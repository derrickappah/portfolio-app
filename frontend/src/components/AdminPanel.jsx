import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, Trash2, Search, LogOut, RefreshCw, Save, Plus, Edit, X,
  User, Info, Code, Briefcase, Phone, Share2, MessageSquare
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { usePortfolio } from '../contexts/PortfolioContext';
import { 
  getContactMessages, 
  deleteContactMessage,
  updatePortfolioSection,
  updateProject,
  createProject,
  deleteProject,
  updateSkill,
  createSkill,
  deleteSkill
} from '../services/supabaseService';

// Form Input Component (reusable)
const FormInput = ({ label, name, value, onChange, type = 'text', placeholder, textarea = false, rows = 4 }) => (
  <div style={{ marginBottom: '24px' }}>
    <label className="label-small" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
      {label}
    </label>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="text-body"
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid var(--border-light)',
          borderRadius: '4px',
          background: 'var(--bg-white)',
          fontSize: '16px',
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="text-body"
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid var(--border-light)',
          borderRadius: '4px',
          background: 'var(--bg-white)',
          fontSize: '16px',
        }}
      />
    )}
  </div>
);

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { portfolioData, loading: portfolioLoading } = usePortfolio();

  // Form states for each section
  const [heroForm, setHeroForm] = useState({ name: '', title: '', description: '', cta: '' });
  const [aboutForm, setAboutForm] = useState({ heading: '', bio: '', yearsExperience: '', projectsCompleted: '', clientsSatisfied: '' });
  const [contactForm, setContactForm] = useState({ heading: '', description: '', email: '', phone: '', location: '' });
  const [socialForm, setSocialForm] = useState({ github: '', linkedin: '', twitter: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);

  // Simple password authentication
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';

  const tabs = [
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'hero', label: 'Hero', icon: User },
    { id: 'about', label: 'About', icon: Info },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'social', label: 'Social', icon: Share2 },
  ];

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchMessages();
    }
  }, []);

  // Load form data when portfolio data is available
  useEffect(() => {
    if (portfolioData && !portfolioLoading) {
      if (portfolioData.hero) {
        setHeroForm({
          name: portfolioData.hero.name || '',
          title: portfolioData.hero.title || '',
          description: portfolioData.hero.description || '',
          cta: portfolioData.hero.cta || '',
        });
      }
      if (portfolioData.about) {
        setAboutForm({
          heading: portfolioData.about.heading || '',
          bio: portfolioData.about.bio || '',
          yearsExperience: portfolioData.about.yearsExperience || '',
          projectsCompleted: portfolioData.about.projectsCompleted || '',
          clientsSatisfied: portfolioData.about.clientsSatisfied || '',
        });
      }
      if (portfolioData.contact) {
        setContactForm({
          heading: portfolioData.contact.heading || '',
          description: portfolioData.contact.description || '',
          email: portfolioData.contact.email || '',
          phone: portfolioData.contact.phone || '',
          location: portfolioData.contact.location || '',
        });
      }
      if (portfolioData.social) {
        setSocialForm({
          github: portfolioData.social.github || '',
          linkedin: portfolioData.social.linkedin || '',
          twitter: portfolioData.social.twitter || '',
        });
      }
    }
  }, [portfolioData, portfolioLoading]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = messages.filter(
        (msg) =>
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchTerm, messages]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      fetchMessages();
      toast({
        title: 'Welcome!',
        description: 'You are now logged in to the admin panel.',
      });
    } else {
      toast({
        title: 'Invalid Password',
        description: 'Please enter the correct password.',
        variant: 'destructive',
      });
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setPassword('');
    navigate('/');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out of the admin panel.',
    });
  };

  const fetchMessages = async () => {
    setLoading(true);
    const result = await getContactMessages();
    if (result.success) {
      setMessages(result.data || []);
      setFilteredMessages(result.data || []);
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to fetch messages.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    const result = await deleteContactMessage(id);
    if (result.success) {
      setMessages(messages.filter((msg) => msg.id !== id));
      setFilteredMessages(filteredMessages.filter((msg) => msg.id !== id));
      toast({
        title: 'Deleted',
        description: 'Message has been deleted successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete message.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Save functions for each section
  const saveHero = async () => {
    setSaving(true);
    const result = await updatePortfolioSection('hero', heroForm);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Hero section updated successfully. Refresh the page to see changes.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update hero section.',
        variant: 'destructive',
      });
    }
    setSaving(false);
  };

  const saveAbout = async () => {
    setSaving(true);
    const result = await updatePortfolioSection('about', aboutForm);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'About section updated successfully. Refresh the page to see changes.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update about section.',
        variant: 'destructive',
      });
    }
    setSaving(false);
  };

  const saveContact = async () => {
    setSaving(true);
    const result = await updatePortfolioSection('contact', contactForm);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Contact section updated successfully. Refresh the page to see changes.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update contact section.',
        variant: 'destructive',
      });
    }
    setSaving(false);
  };

  const saveSocial = async () => {
    setSaving(true);
    const result = await updatePortfolioSection('social', socialForm);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Social links updated successfully. Refresh the page to see changes.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update social links.',
        variant: 'destructive',
      });
    }
    setSaving(false);
  };

  const saveProject = async (projectData) => {
    setSaving(true);
    let result;
    if (editingProject) {
      result = await updateProject(editingProject.id, projectData);
    } else {
      result = await createProject(projectData);
    }
    
    if (result.success) {
      toast({
        title: 'Success',
        description: `Project ${editingProject ? 'updated' : 'created'} successfully. Refresh the page to see changes.`,
      });
      setEditingProject(null);
      window.location.reload(); // Reload to get updated data
    } else {
      toast({
        title: 'Error',
        description: result.error || `Failed to ${editingProject ? 'update' : 'create'} project.`,
        variant: 'destructive',
      });
    }
    setSaving(false);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    const result = await deleteProject(id);
    if (result.success) {
      toast({
        title: 'Deleted',
        description: 'Project deleted successfully.',
      });
      window.location.reload();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete project.',
        variant: 'destructive',
      });
    }
  };

  const saveSkill = async (skillData) => {
    setSaving(true);
    let result;
    if (editingSkill) {
      result = await updateSkill(editingSkill.id, skillData);
    } else {
      result = await createSkill(skillData);
    }
    
    if (result.success) {
      toast({
        title: 'Success',
        description: `Skill group ${editingSkill ? 'updated' : 'created'} successfully. Refresh the page to see changes.`,
      });
      setEditingSkill(null);
      window.location.reload();
    } else {
      toast({
        title: 'Error',
        description: result.error || `Failed to ${editingSkill ? 'update' : 'create'} skill group.`,
        variant: 'destructive',
      });
    }
    setSaving(false);
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill group?')) {
      return;
    }

    const result = await deleteSkill(id);
    if (result.success) {
      toast({
        title: 'Deleted',
        description: 'Skill group deleted successfully.',
      });
      window.location.reload();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete skill group.',
        variant: 'destructive',
      });
    }
  };

  // Form input component
  const FormInput = ({ label, name, value, onChange, type = 'text', placeholder, textarea = false, rows = 4 }) => (
    <div style={{ marginBottom: '24px' }}>
      <label className="label-small" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="text-body"
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid var(--border-light)',
            borderRadius: '4px',
            background: 'var(--bg-white)',
            fontSize: '16px',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="text-body"
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid var(--border-light)',
            borderRadius: '4px',
            background: 'var(--bg-white)',
            fontSize: '16px',
          }}
        />
      )}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background)' }}>
        <div className="card" style={{ padding: '48px', maxWidth: '400px', width: '100%' }}>
          <h2 className="title-big" style={{ marginBottom: '24px', textAlign: 'center' }}>
            Admin Login
          </h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label className="label-small" style={{ display: 'block', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-body"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border-light)',
                  borderRadius: '4px',
                  background: 'var(--bg-white)',
                  fontSize: '16px',
                }}
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-accent"
              style={{ width: '100%' }}
            >
              Login
            </button>
          </form>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
            style={{ width: '100%', marginTop: '16px' }}
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <div className="grid-background" />
      <main style={{ position: 'relative', zIndex: 1, paddingTop: '48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 48px' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h1 className="title-big" style={{ marginBottom: '8px' }}>
                Admin Panel
              </h1>
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                Manage your portfolio content
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '32px',
              flexWrap: 'wrap',
              borderBottom: '2px solid var(--border-light)',
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--accent-foreground)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: activeTab === tab.id ? 600 : 400,
                    borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    marginBottom: '-2px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="card" style={{ padding: '32px' }}>
            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 className="text-regular" style={{ fontSize: '24px', fontWeight: 600 }}>
                    Contact Messages
                  </h2>
                  <button
                    onClick={fetchMessages}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <RefreshCw size={18} />
                    Refresh
                  </button>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ position: 'relative' }}>
                    <Search
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-body"
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 48px',
                        border: '1px solid var(--border-light)',
                        borderRadius: '4px',
                        background: 'var(--bg-white)',
                        fontSize: '16px',
                      }}
                    />
                  </div>
                </div>

                {loading ? (
                  <div style={{ padding: '48px', textAlign: 'center' }}>
                    <p className="text-body">Loading messages...</p>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div style={{ padding: '48px', textAlign: 'center' }}>
                    <Mail size={48} style={{ margin: '0 auto 16px', color: 'var(--text-secondary)' }} />
                    <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                      {searchTerm ? 'No messages found matching your search.' : 'No messages yet.'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className="card"
                        style={{
                          padding: '24px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '';
                        }}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '12px',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <h3
                              className="text-regular"
                              style={{ marginBottom: '4px', fontWeight: 600 }}
                            >
                              {message.subject}
                            </h3>
                            <p className="text-body" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                              {message.name} • {message.email}
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span className="label-small" style={{ color: 'var(--text-secondary)' }}>
                              {formatDate(message.created_at)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(message.id);
                              }}
                              style={{
                                padding: '8px',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: 'var(--color-error)',
                                borderRadius: '4px',
                                transition: 'background 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 56, 56, 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                              }}
                              title="Delete message"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <p
                          className="text-body"
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '14px',
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {message.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && (
                  <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <p className="label-small" style={{ color: 'var(--text-secondary)' }}>
                      Showing {filteredMessages.length} of {messages.length} message{messages.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Hero Tab */}
            {activeTab === 'hero' && (
              <div>
                <h2 className="text-regular" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '32px' }}>
                  Edit Hero Section
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveHero();
                  }}
                >
                  <FormInput
                    label="Name"
                    name="name"
                    value={heroForm.name}
                    onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })}
                    placeholder="Your full name"
                  />
                  <FormInput
                    label="Title"
                    name="title"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    placeholder="Your professional title"
                  />
                  <FormInput
                    label="Description"
                    name="description"
                    value={heroForm.description}
                    onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                    placeholder="A brief description about yourself"
                    textarea
                    rows={4}
                  />
                  <FormInput
                    label="CTA Button Text"
                    name="cta"
                    value={heroForm.cta}
                    onChange={(e) => setHeroForm({ ...heroForm, cta: e.target.value })}
                    placeholder="View Projects"
                  />
                  <button
                    type="submit"
                    className="btn-accent"
                    disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div>
                <h2 className="text-regular" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '32px' }}>
                  Edit About Section
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveAbout();
                  }}
                >
                  <FormInput
                    label="Heading"
                    name="heading"
                    value={aboutForm.heading}
                    onChange={(e) => setAboutForm({ ...aboutForm, heading: e.target.value })}
                    placeholder="ABOUT ME"
                  />
                  <FormInput
                    label="Bio"
                    name="bio"
                    value={aboutForm.bio}
                    onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                    placeholder="Your bio description"
                    textarea
                    rows={6}
                  />
                  <FormInput
                    label="Years Experience"
                    name="yearsExperience"
                    value={aboutForm.yearsExperience}
                    onChange={(e) => setAboutForm({ ...aboutForm, yearsExperience: e.target.value })}
                    placeholder="1+"
                  />
                  <FormInput
                    label="Projects Completed"
                    name="projectsCompleted"
                    value={aboutForm.projectsCompleted}
                    onChange={(e) => setAboutForm({ ...aboutForm, projectsCompleted: e.target.value })}
                    placeholder="10+"
                  />
                  <FormInput
                    label="Happy Clients"
                    name="clientsSatisfied"
                    value={aboutForm.clientsSatisfied}
                    onChange={(e) => setAboutForm({ ...aboutForm, clientsSatisfied: e.target.value })}
                    placeholder="10+"
                  />
                  <button
                    type="submit"
                    className="btn-accent"
                    disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div>
                <h2 className="text-regular" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '32px' }}>
                  Edit Contact Section
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveContact();
                  }}
                >
                  <FormInput
                    label="Heading"
                    name="heading"
                    value={contactForm.heading}
                    onChange={(e) => setContactForm({ ...contactForm, heading: e.target.value })}
                    placeholder="LET'S WORK TOGETHER"
                  />
                  <FormInput
                    label="Description"
                    name="description"
                    value={contactForm.description}
                    onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                    placeholder="Have a project in mind? Let's discuss..."
                    textarea
                    rows={3}
                  />
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                  <FormInput
                    label="Phone"
                    name="phone"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                  <FormInput
                    label="Location"
                    name="location"
                    value={contactForm.location}
                    onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                    placeholder="City, Country"
                  />
                  <button
                    type="submit"
                    className="btn-accent"
                    disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
              <div>
                <h2 className="text-regular" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '32px' }}>
                  Edit Social Links
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveSocial();
                  }}
                >
                  <FormInput
                    label="GitHub URL"
                    name="github"
                    type="url"
                    value={socialForm.github}
                    onChange={(e) => setSocialForm({ ...socialForm, github: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                  <FormInput
                    label="LinkedIn URL"
                    name="linkedin"
                    type="url"
                    value={socialForm.linkedin}
                    onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                  <FormInput
                    label="Twitter URL"
                    name="twitter"
                    type="url"
                    value={socialForm.twitter}
                    onChange={(e) => setSocialForm({ ...socialForm, twitter: e.target.value })}
                    placeholder="https://twitter.com/username"
                  />
                  <button
                    type="submit"
                    className="btn-accent"
                    disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 className="text-regular" style={{ fontSize: '24px', fontWeight: 600 }}>
                    Manage Skills
                  </h2>
                  <button
                    onClick={() => setEditingSkill({ category: '', technologies: [] })}
                    className="btn-accent"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Plus size={18} />
                    Add Skill Group
                  </button>
                </div>

                {editingSkill ? (
                  <SkillForm
                    skill={editingSkill}
                    onSave={saveSkill}
                    onCancel={() => setEditingSkill(null)}
                    saving={saving}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {portfolioData?.skills?.map((skill) => (
                      <div key={skill.id} className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h3 className="text-regular" style={{ fontWeight: 600 }}>
                            {skill.category}
                          </h3>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setEditingSkill(skill)}
                              className="btn-primary"
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                            >
                              <Edit size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="btn-accent"
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                padding: '8px 16px',
                                background: 'var(--color-error)'
                              }}
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {skill.technologies?.map((tech, idx) => (
                            <span
                              key={idx}
                              className="label-small"
                              style={{
                                padding: '6px 12px',
                                background: 'var(--color-background)',
                                borderRadius: '4px',
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 className="text-regular" style={{ fontSize: '24px', fontWeight: 600 }}>
                    Manage Projects
                  </h2>
                  <button
                    onClick={() => setEditingProject({ title: '', category: '', description: '', technologies: [], image: '', link: '', featured: false })}
                    className="btn-accent"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Plus size={18} />
                    Add Project
                  </button>
                </div>

                {editingProject ? (
                  <ProjectForm
                    project={editingProject}
                    onSave={saveProject}
                    onCancel={() => setEditingProject(null)}
                    saving={saving}
                  />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {portfolioData?.projects?.map((project) => (
                      <div key={project.id} className="card" style={{ padding: '24px' }}>
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              marginBottom: '16px',
                            }}
                          />
                        )}
                        <h3 className="text-regular" style={{ fontWeight: 600, marginBottom: '8px' }}>
                          {project.title}
                        </h3>
                        <p className="label-small" style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                          {project.category}
                        </p>
                        <p
                          className="text-body"
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '14px',
                            marginBottom: '16px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {project.description}
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setEditingProject(project)}
                            className="btn-primary"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 16px' }}
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="btn-accent"
                            style={{ 
                              flex: 1,
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              gap: '8px', 
                              padding: '8px 16px',
                              background: 'var(--color-error)'
                            }}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '24px',
              animation: 'fadeIn 0.2s ease',
            }}
            onClick={() => setSelectedMessage(null)}
          >
            <div
              className="card"
              style={{
                maxWidth: '700px',
                width: '100%',
                maxHeight: '85vh',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                animation: 'scaleIn 0.2s ease',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '32px 32px 24px',
                  borderBottom: '1px solid var(--border-light)',
                  background: 'var(--bg-white)',
                }}
              >
                <div style={{ flex: 1, paddingRight: '16px' }}>
                  <h2
                    className="text-regular"
                    style={{
                      marginBottom: '16px',
                      fontWeight: 600,
                      fontSize: '24px',
                      lineHeight: 1.3,
                    }}
                  >
                    {selectedMessage.subject}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
                      <p className="text-body" style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                        <strong style={{ color: 'var(--text-primary)' }}>From:</strong> {selectedMessage.name}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
                      <p className="text-body" style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Email:</strong>{' '}
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          style={{
                            color: 'var(--accent-primary)',
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                        >
                          {selectedMessage.email}
                        </a>
                      </p>
                    </div>
                    <p className="label-small" style={{ color: 'var(--text-secondary)', margin: 0, marginTop: '4px' }}>
                      {formatDate(selectedMessage.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  style={{
                    padding: '8px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-background)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                  title="Close"
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  padding: '32px',
                  background: 'var(--bg-white)',
                  overflowY: 'auto',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    padding: '24px',
                    background: 'var(--color-background)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <p
                    className="text-body"
                    style={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.8,
                      margin: 0,
                      color: 'var(--text-primary)',
                      fontSize: '15px',
                    }}
                  >
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: '24px 32px',
                  borderTop: '1px solid var(--border-light)',
                  background: 'var(--bg-white)',
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                  }}
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Mail size={18} />
                  Reply via Email
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this message?')) {
                      handleDelete(selectedMessage.id);
                      setSelectedMessage(null);
                    }
                  }}
                  className="btn-accent"
                  style={{
                    background: 'var(--color-error)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Skill Form Component
const SkillForm = ({ skill, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    category: skill.category || '',
    technologies: skill.technologies ? skill.technologies.join(', ') : '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const technologies = formData.technologies.split(',').map(t => t.trim()).filter(t => t);
    onSave({
      category: formData.category,
      technologies: technologies,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '24px' }}>
      <FormInput
        label="Category"
        name="category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        placeholder="e.g., Frontend, Backend, Tools"
      />
      <FormInput
        label="Technologies (comma-separated)"
        name="technologies"
        value={formData.technologies}
        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
        placeholder="React, TypeScript, Node.js, PostgreSQL"
        textarea
        rows={3}
      />
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <X size={18} />
          Cancel
        </button>
        <button
          type="submit"
          className="btn-accent"
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

// Project Form Component
const ProjectForm = ({ project, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    title: project.title || '',
    category: project.category || '',
    description: project.description || '',
    technologies: project.technologies ? project.technologies.join(', ') : '',
    image: project.image || '',
    link: project.link || '',
    featured: project.featured || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const technologies = formData.technologies.split(',').map(t => t.trim()).filter(t => t);
    onSave({
      title: formData.title,
      category: formData.category,
      description: formData.description,
      technologies: technologies,
      image: formData.image,
      link: formData.link,
      featured: formData.featured,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '24px' }}>
      <FormInput
        label="Title"
        name="title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Project Title"
      />
      <FormInput
        label="Category"
        name="category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        placeholder="Full-Stack, Frontend, or Backend"
      />
      <FormInput
        label="Description"
        name="description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Project description"
        textarea
        rows={4}
      />
      <FormInput
        label="Technologies (comma-separated)"
        name="technologies"
        value={formData.technologies}
        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
        placeholder="React, Node.js, PostgreSQL"
        textarea
        rows={2}
      />
      <FormInput
        label="Image URL"
        name="image"
        type="url"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        placeholder="https://example.com/image.jpg or /path/to/image.png"
      />
      <FormInput
        label="Project Link"
        name="link"
        type="url"
        value={formData.link}
        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        placeholder="https://project-url.com"
      />
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <span className="label-small">Featured Project</span>
        </label>
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <X size={18} />
          Cancel
        </button>
        <button
          type="submit"
          className="btn-accent"
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default AdminPanel;
