import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Shield, FileText, Eye, ExternalLink } from 'lucide-react';
import siteInfoService from '../../services/siteInfo.service';
import Snackbar from '../common/Snackbar';

const LegalPagesEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('privacy');
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const [privacyPolicy, setPrivacyPolicy] = useState({
    title: 'Política de Privacidad',
    content: ''
  });

  const [termsAndConditions, setTermsAndConditions] = useState({
    title: 'Términos y Condiciones',
    content: ''
  });

  useEffect(() => {
    fetchLegalPages();
  }, []);

  const showSnackbar = (message, type = 'success') => {
    setSnackbar({
      isOpen: true,
      message,
      type
    });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isOpen: false }));
  };

  const fetchLegalPages = async () => {
    setLoading(true);
    try {
      const [privacyRes, termsRes] = await Promise.all([
        siteInfoService.getPrivacyPolicy(),
        siteInfoService.getTermsAndConditions()
      ]);

      if (privacyRes.success && privacyRes.data) {
        setPrivacyPolicy({
          title: privacyRes.data.title || 'Política de Privacidad',
          content: privacyRes.data.content || ''
        });
      }

      if (termsRes.success && termsRes.data) {
        setTermsAndConditions({
          title: termsRes.data.title || 'Términos y Condiciones',
          content: termsRes.data.content || ''
        });
      }
    } catch (error) {
      showSnackbar('Error al cargar las páginas legales', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    try {
      const response = await siteInfoService.updatePrivacyPolicy(privacyPolicy);
      if (response.success) {
        showSnackbar('Política de privacidad actualizada exitosamente', 'success');
      }
    } catch (error) {
      showSnackbar('Error al guardar la política de privacidad', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTerms = async () => {
    setSaving(true);
    try {
      const response = await siteInfoService.updateTermsAndConditions(termsAndConditions);
      if (response.success) {
        showSnackbar('Términos y condiciones actualizados exitosamente', 'success');
      }
    } catch (error) {
      showSnackbar('Error al guardar los términos y condiciones', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-gallery-900 mb-4 sm:mb-0">
            Páginas Legales
          </h2>
          <div className="flex gap-2">
            <a
              href="/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-sm inline-flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              Ver Privacidad
            </a>
            <a
              href="/terminos"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-sm inline-flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              Ver Términos
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gallery-200 mb-6">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'privacy'
                ? 'text-accent border-accent'
                : 'text-gallery-600 border-transparent hover:text-gallery-900'
            }`}
          >
            <Shield className="h-4 w-4" />
            Política de Privacidad
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'terms'
                ? 'text-accent border-accent'
                : 'text-gallery-600 border-transparent hover:text-gallery-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            Términos y Condiciones
          </button>
        </div>

        {/* Privacy Policy Editor */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={privacyPolicy.title}
                onChange={(e) => setPrivacyPolicy(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Contenido
              </label>
              <p className="text-xs text-gallery-500 mb-2">
                Usa formato Markdown: ## para títulos, ### para subtítulos, - para listas, **texto** para negrita
              </p>
              <textarea
                value={privacyPolicy.content}
                onChange={(e) => setPrivacyPolicy(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent font-mono text-sm"
                placeholder="## 1. Información que Recopilamos

En nuestra galería de arte, recopilamos información personal que usted nos proporciona voluntariamente..."
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gallery-200">
              <button
                onClick={handleSavePrivacy}
                disabled={saving}
                className="btn-primary flex items-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Guardar Política de Privacidad
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Terms and Conditions Editor */}
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={termsAndConditions.title}
                onChange={(e) => setTermsAndConditions(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gallery-700 mb-1">
                Contenido
              </label>
              <p className="text-xs text-gallery-500 mb-2">
                Usa formato Markdown: ## para títulos, ### para subtítulos, - para listas, **texto** para negrita
              </p>
              <textarea
                value={termsAndConditions.content}
                onChange={(e) => setTermsAndConditions(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full px-3 py-2 border border-gallery-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent font-mono text-sm"
                placeholder="## 1. Aceptación de los Términos

Al acceder y utilizar este sitio web de galería de arte, usted acepta cumplir con estos términos y condiciones..."
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gallery-200">
              <button
                onClick={handleSaveTerms}
                disabled={saving}
                className="btn-primary flex items-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Guardar Términos y Condiciones
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </motion.div>
  );
};

export default LegalPagesEditor;
