import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useSupabase, setUseSupabase] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        // Check if Supabase is configured
        const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
        const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          console.error('❌ Supabase not configured');
          console.error('   Make sure you have REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file');
          setError('Supabase not configured. Please check your environment variables.');
          setLoading(false);
          return;
        }

        console.log('🔍 Attempting to fetch data from Supabase...');

        // Fetch portfolio data from Supabase
        // Your table uses UUID, so we only try UUID
        let portfolioDataResult = null;
        let portfolioError = null;
        
        try {
          const result = await supabase
            .from('portfolio_data')
            .select('*')
            .eq('id', '00000000-0000-0000-0000-000000000001')
            .maybeSingle();
          
          portfolioDataResult = result.data;
          portfolioError = result.error;
          
          // Ignore monitoring script errors (Response body already used)
          if (portfolioError && portfolioError.message && 
              portfolioError.message.includes('Response body is already used')) {
            // Silently ignore - the data might still be in the result
            if (portfolioDataResult) {
              portfolioError = null; // Clear the error if we have data
            }
          }
        } catch (err) {
          console.error('Exception fetching portfolio data:', err);
          portfolioError = err;
        }

        if (portfolioError && !portfolioDataResult) {
          console.warn('⚠️ Error fetching portfolio data from Supabase:', portfolioError);
          console.warn('   Error code:', portfolioError.code);
          console.warn('   Error message:', portfolioError.message);
          
          // Check for CORS/502 errors (project paused)
          const errorMsg = portfolioError.message || '';
          if (errorMsg.includes('CORS') || errorMsg.includes('502') || errorMsg.includes('Bad Gateway') || errorMsg.includes('ERR_FAILED')) {
            console.error('   ❌ CORS or 502 Error detected!');
            console.error('   This usually means:');
            console.error('   1. Your Supabase project is PAUSED - go to dashboard and restore it');
            console.error('   2. Network connectivity issues');
            console.error('   3. Supabase service is temporarily down');
            console.error('   💡 Check: https://supabase.com/dashboard/project/qlzmvmtppavjgerhybju');
          }
          
          console.error('   💡 Once Supabase is restored, refresh the page');
          setError('Failed to fetch portfolio data from Supabase. Please check your connection.');
          setLoading(false);
          return;
        }

        if (!portfolioDataResult) {
          console.error('❌ No portfolio data found in Supabase');
          console.error('   💡 Run the SQL migration in Supabase SQL Editor');
          setError('No portfolio data found. Please run the SQL migration in Supabase.');
          setLoading(false);
          return;
        }

        console.log('✅ Portfolio data fetched from Supabase');
        console.log('   Data structure:', {
          hasHero: !!portfolioDataResult.hero,
          hasAbout: !!portfolioDataResult.about,
          hasContact: !!portfolioDataResult.contact,
          hasSocial: !!portfolioDataResult.social
        });

        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: true });

        if (projectsError) {
          console.warn('⚠️ Error fetching projects from Supabase:', projectsError);
          if (projectsError.message?.includes('CORS') || projectsError.message?.includes('502')) {
            console.error('   ❌ CORS/502 error - check if Supabase project is paused');
          }
        } else {
          console.log(`✅ Fetched ${projectsData?.length || 0} projects from Supabase`);
        }

        // Fetch skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .order('id', { ascending: true });

        if (skillsError) {
          console.warn('⚠️ Error fetching skills from Supabase:', skillsError);
        } else {
          console.log(`✅ Fetched ${skillsData?.length || 0} skills from Supabase`);
        }

        // Combine data - ensure we parse JSONB fields correctly
        const parseJsonb = (value) => {
          if (!value) return null;
          if (typeof value === 'string') {
            try {
              return JSON.parse(value);
            } catch {
              return value;
            }
          }
          return value;
        };

        const combinedData = {
          hero: parseJsonb(portfolioDataResult.hero),
          about: parseJsonb(portfolioDataResult.about),
          contact: parseJsonb(portfolioDataResult.contact),
          social: parseJsonb(portfolioDataResult.social),
          projects: projectsData || [],
          skills: skillsData || [],
        };
        
        console.log('📊 Combined data:', {
          heroName: combinedData.hero?.name,
          aboutHeading: combinedData.about?.heading,
          aboutNumbers: {
            yearsExperience: combinedData.about?.yearsExperience,
            projectsCompleted: combinedData.about?.projectsCompleted,
            clientsSatisfied: combinedData.about?.clientsSatisfied
          },
          projectsCount: combinedData.projects?.length,
          skillsCount: combinedData.skills?.length
        });
        
        // Debug: Log the raw about data from Supabase
        console.log('🔍 Raw about data from Supabase:', {
          raw: portfolioDataResult.about,
          parsed: parseJsonb(portfolioDataResult.about),
          type: typeof portfolioDataResult.about
        });
        
        setPortfolioData(combinedData);
        setUseSupabase(true);
        console.log('✅ Using Supabase data');
      } catch (err) {
        console.error('❌ Error fetching portfolio data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolioData, loading, error, useSupabase }}>
      {children}
    </PortfolioContext.Provider>
  );
};

