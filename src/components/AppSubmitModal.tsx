import React, { useState } from 'react';
import { 
  X, Copy, Check, Sparkles, Download, Plus, Trash2, 
  HelpCircle, Code2, ChevronRight, Folder, Globe, Smartphone, Monitor
} from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';
import { AppItem, PlatformType, AppCategory, DownloadOption } from '../types/app';
import { triggerDownloadConfetti } from '../utils/confetti';

interface AppSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSubmitModal: React.FC<AppSubmitModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'form' | 'json' | 'tutorial'>('form');

  // Form State
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AppCategory>('Productivité');
  const [platforms, setPlatforms] = useState<PlatformType[]>(['apk']);
  const [version, setVersion] = useState('1.0.0');
  const [size, setSize] = useState('15.0 Mo');
  const [badge, setBadge] = useState('Nouveau');
  const [rating] = useState('4.9');
  const [authorName] = useState('Sky Apps');
  const [authorUrl] = useState('https://github.com');
  const [iconUrl, setIconUrl] = useState('/apps/mon-app/icon.png');
  const [bannerUrl, setBannerUrl] = useState('/apps/mon-app/banner.jpg');
  const [githubRepo, setGithubRepo] = useState('');
  const [website] = useState('');
  const [featured, setFeatured] = useState(false);

  // Features list
  const [features, setFeatures] = useState<string[]>([
    'Fonctionnalité principale ultra-rapide',
    'Interface utilisateur soignée et intuitive',
    'Zéro publicité et respect de la vie privée'
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Downloads list
  const [downloads, setDownloads] = useState<DownloadOption[]>([
    {
      id: 'download-1',
      label: 'Télécharger APK (Android)',
      platform: 'apk',
      url: '/downloads/mon-app.apk',
      size: '15.0 Mo',
      version: '1.0.0',
      primary: true
    }
  ]);

  if (!isOpen) return null;

  // Auto-generate slug ID when name changes if id not custom
  const handleNameChange = (val: string) => {
    setName(val);
    const slug = val
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setId(slug);
    if (!iconUrl || iconUrl.startsWith('/apps/')) {
      setIconUrl(`/apps/${slug || 'mon-app'}/icon.png`);
    }
    if (!bannerUrl || bannerUrl.startsWith('/apps/')) {
      setBannerUrl(`/apps/${slug || 'mon-app'}/banner.jpg`);
    }
  };

  const togglePlatform = (p: PlatformType) => {
    if (platforms.includes(p)) {
      if (platforms.length > 1) {
        setPlatforms(platforms.filter(item => item !== p));
      }
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const addFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addDownload = () => {
    const newDl: DownloadOption = {
      id: `download-${downloads.length + 1}`,
      label: 'Installateur Windows (.exe)',
      platform: 'exe',
      url: `/downloads/${id || 'mon-app'}-setup.exe`,
      size: '20.0 Mo',
      version: version || '1.0.0',
      primary: false
    };
    setDownloads([...downloads, newDl]);
  };

  const removeDownload = (index: number) => {
    if (downloads.length > 1) {
      setDownloads(downloads.filter((_, i) => i !== index));
    }
  };

  const updateDownload = (index: number, field: keyof DownloadOption, value: any) => {
    const updated = [...downloads];
    updated[index] = { ...updated[index], [field]: value };
    setDownloads(updated);
  };

  // Generate generated JSON Object
  const generatedAppObject: AppItem = {
    id: id || 'nouvelle-application',
    name: name || 'Nom de votre application',
    tagline: tagline || 'Slogan court et percutant de votre application',
    description: description || 'Description complète présentant les fonctionnalités et atouts de votre logiciel.',
    icon: iconUrl,
    banner: bannerUrl || undefined,
    category,
    platforms,
    featured,
    badge: badge || undefined,
    rating: parseFloat(rating) || 4.9,
    author: {
      name: authorName,
      url: authorUrl || undefined
    },
    version: version || '1.0.0',
    size: size || '10 Mo',
    releaseDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    screenshots: [
      bannerUrl || iconUrl
    ],
    features: features.filter(f => f.trim().length > 0),
    requirements: {
      "Compatibilité": platforms.includes('apk') ? 'Android 8.0+' : platforms.includes('exe') ? 'Windows 10/11' : 'Navigateur moderne'
    },
    changelog: [
      {
        version: version || '1.0.0',
        date: 'Aujourd\'hui',
        notes: [
          'Version initiale disponible sur Sky Apps Store'
        ]
      }
    ],
    downloads,
    githubRepo: githubRepo || undefined,
    website: website || undefined
  };

  const jsonString = JSON.stringify(generatedAppObject, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    triggerDownloadConfetti();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSnippet = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id || 'app'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerDownloadConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-[#f5f5f7] rounded-3xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/15 my-auto z-10 max-h-[92vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#0071e3] to-[#5856d6] text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Générateur d'Application pour GitHub
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Configurez votre application et générez le bloc pour <code>src/data/apps.json</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-black/5 dark:border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveView('form')}
            className={`pb-3 px-3 transition-colors border-b-2 ${
              activeView === 'form'
                ? 'border-[#0071e3] text-[#0071e3] dark:text-[#2997ff]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            1. Formulaire Interactif
          </button>
          <button
            onClick={() => setActiveView('json')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeView === 'json'
                ? 'border-[#0071e3] text-[#0071e3] dark:text-[#2997ff]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>2. Code JSON Prêt à Coller</span>
          </button>
          <button
            onClick={() => setActiveView('tutorial')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeView === 'tutorial'
                ? 'border-[#0071e3] text-[#0071e3] dark:text-[#2997ff]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>3. Tuto Hébergement &amp; GitHub (30s)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {activeView === 'form' && (
            <div className="space-y-6 text-xs">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Nom de l'application *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: SkyStream Player"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Identifiant unique (slug dossier / url)
                  </label>
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="skystream-player"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Slogan court / Tagline *
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Ex: Lecteur multimédia moderne & streaming local sans publicité"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description détaillée
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Présentation des fonctionnalités, avantages, utilité pour vos utilisateurs..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              {/* Category and Platforms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AppCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white cursor-pointer"
                  >
                    <option value="Productivité" className="dark:bg-[#1c1c1e]">Productivité</option>
                    <option value="Utilitaires" className="dark:bg-[#1c1c1e]">Utilitaires</option>
                    <option value="Multimédia" className="dark:bg-[#1c1c1e]">Multimédia</option>
                    <option value="Outils IA" className="dark:bg-[#1c1c1e]">Outils IA</option>
                    <option value="Jeux" className="dark:bg-[#1c1c1e]">Jeux</option>
                    <option value="Développement" className="dark:bg-[#1c1c1e]">Développement</option>
                    <option value="Autre" className="dark:bg-[#1c1c1e]">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Plateformes compatibles
                  </label>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {(['apk', 'exe', 'extension', 'web'] as PlatformType[]).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePlatform(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          platforms.includes(p)
                            ? 'bg-[#0071e3] text-white shadow-sm'
                            : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-black/10'
                        }`}
                      >
                        {p === 'apk' ? 'Android APK' : p === 'exe' ? 'Windows EXE' : p === 'extension' ? 'Extension' : 'Web'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Version, Size, Badge, Featured */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Version</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="1.0.0"
                    className="w-full px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Taille</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="18.5 Mo"
                    className="w-full px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Badge</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Ex: Nouveau, v2.0"
                    className="w-full px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded text-[#0071e3] focus:ring-[#0071e3] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">À la une (Hero)</span>
                  </label>
                </div>
              </div>

              {/* Icons & Media */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-gray-700 dark:text-gray-300">
                      Chemin / URL de l'icône
                    </label>
                    <span className="text-[10px] text-gray-400">📁 Dossier public/apps/</span>
                  </div>
                  <input
                    type="text"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    placeholder="/apps/mon-app/icon.png ou https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono text-[11px]"
                  />
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIconUrl(`/apps/${id || 'mon-app'}/icon.png`)}
                      className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 text-gray-600 dark:text-gray-300 flex items-center gap-1 font-mono"
                    >
                      <Folder className="w-2.5 h-2.5" /> /apps/{id || 'mon-app'}/icon.png
                    </button>
                    <button
                      type="button"
                      onClick={() => setIconUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&h=256&fit=crop&q=80')}
                      className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 text-gray-600 dark:text-gray-300 flex items-center gap-1"
                    >
                      <Globe className="w-2.5 h-2.5" /> Image Unsplash
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-gray-700 dark:text-gray-300">
                      Chemin / URL Bannière &amp; Capture
                    </label>
                    <span className="text-[10px] text-gray-400">📁 Dossier public/apps/</span>
                  </div>
                  <input
                    type="text"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="/apps/mon-app/banner.jpg ou https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono text-[11px]"
                  />
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setBannerUrl(`/apps/${id || 'mon-app'}/banner.jpg`)}
                      className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 text-gray-600 dark:text-gray-300 flex items-center gap-1 font-mono"
                    >
                      <Folder className="w-2.5 h-2.5" /> /apps/{id || 'mon-app'}/banner.jpg
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerUrl('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop&q=80')}
                      className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 text-gray-600 dark:text-gray-300 flex items-center gap-1"
                    >
                      <Globe className="w-2.5 h-2.5" /> Bannière Unsplash
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700 dark:text-gray-300">
                  Points forts / Fonctionnalités clés
                </label>
                <div className="space-y-2">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const updated = [...features];
                          updated[idx] = e.target.value;
                          setFeatures(updated);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                      placeholder="Ajouter une autre fonctionnalité..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-dashed border-black/20 dark:border-white/20"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Downloads list */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300">
                      Fichiers téléchargeables (Direct sur le site ou GitHub Releases)
                    </label>
                    <span className="text-[11px] text-gray-500">
                      Utilisez <code>/downloads/fichier.apk</code> pour télécharger directement depuis votre site
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addDownload}
                    className="text-xs text-[#0071e3] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter un fichier</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {downloads.map((dl, idx) => (
                    <div key={dl.id || idx} className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={dl.label}
                          onChange={(e) => updateDownload(idx, 'label', e.target.value)}
                          placeholder="Libellé du bouton"
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 font-semibold"
                        />
                        <select
                          value={dl.platform}
                          onChange={(e) => updateDownload(idx, 'platform', e.target.value as PlatformType)}
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/30 border border-black/10 dark:border-white/10"
                        >
                          <option value="apk">Android APK</option>
                          <option value="exe">Windows EXE</option>
                          <option value="extension">Extension</option>
                          <option value="web">Web</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={dl.size || ''}
                            onChange={(e) => updateDownload(idx, 'size', e.target.value)}
                            placeholder="Taille (ex: 24 Mo)"
                            className="w-24 px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/30 border border-black/10 dark:border-white/10"
                          />
                          {downloads.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDownload(idx)}
                              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={dl.url}
                          onChange={(e) => updateDownload(idx, 'url', e.target.value)}
                          placeholder="/downloads/mon-app.apk ou https://github.com/.../releases/..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 font-mono text-[11px]"
                        />

                        {/* Quick path autofill buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => updateDownload(idx, 'url', `/downloads/${id || 'mon-app'}.apk`)}
                            className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-1 font-mono"
                          >
                            <Smartphone className="w-2.5 h-2.5" /> /downloads/{id || 'mon-app'}.apk
                          </button>
                          <button
                            type="button"
                            onClick={() => updateDownload(idx, 'url', `/downloads/${id || 'mon-app'}-setup.exe`)}
                            className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 flex items-center gap-1 font-mono"
                          >
                            <Monitor className="w-2.5 h-2.5" /> /downloads/{id || 'mon-app'}-setup.exe
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Repo */}
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Lien GitHub du code source (Optionnel)
                </label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="https://github.com/votre-compte/mon-app"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono text-[11px]"
                />
              </div>
            </div>
          )}

          {activeView === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Copiez ce code JSON et collez-le dans le tableau du fichier <code className="text-[#0071e3] font-bold">src/data/apps.json</code> :
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadSnippet}
                    className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger .json</span>
                  </button>
                  <button
                    onClick={handleCopyJson}
                    className="px-4 py-1.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copié !' : 'Copier le JSON'}</span>
                  </button>
                </div>
              </div>

              <div className="relative rounded-2xl bg-[#0d1117] text-gray-200 p-4 font-mono text-xs overflow-x-auto max-h-[420px] border border-white/10">
                <pre>{jsonString}</pre>
              </div>
            </div>
          )}

          {activeView === 'tutorial' && (
            <div className="space-y-6 text-xs text-gray-700 dark:text-gray-300">
              
              {/* Option 1: Direct in public folder */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Folder className="w-4 h-4" />
                  <span>Méthode 1 (Recommandée) : Héberger directement dans le projet</span>
                </div>
                <p className="leading-relaxed">
                  Déposez vos images dans <code className="bg-emerald-500/20 px-1.5 py-0.5 rounded">public/apps/votre-app/</code> et vos fichiers dans <code className="bg-emerald-500/20 px-1.5 py-0.5 rounded">public/downloads/</code>.
                </p>
                <div className="p-2.5 rounded-xl bg-black/10 font-mono text-[11px] space-y-1">
                  <div><strong>Icône :</strong> <code>/apps/mon-app/icon.png</code></div>
                  <div><strong>Bannière :</strong> <code>/apps/mon-app/banner.jpg</code></div>
                  <div><strong>Téléchargement direct :</strong> <code>/downloads/mon-app.apk</code> ou <code>/downloads/mon-app-setup.exe</code></div>
                </div>
                <div className="text-[11px]">
                  ✨ <strong>Résultat :</strong> Téléchargement direct immédiat depuis votre domaine Vercel sans redirection externe.
                </div>
              </div>

              {/* Option 2: GitHub Releases */}
              <div className="p-4 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 text-[#0071e3] dark:text-[#2997ff] space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <GithubIcon className="w-4 h-4" />
                  <span>Méthode 2 : Fichiers volumineux via GitHub Releases (&gt; 100 Mo)</span>
                </div>
                <p className="leading-relaxed">
                  Sur le dépôt GitHub de l'application, créez une Release (<code className="bg-[#0071e3]/20 px-1 rounded">Releases &gt; New release</code>), déposez votre APK/EXE et collez le lien direct dans le champ de téléchargement :
                </p>
                <div className="p-2.5 rounded-xl bg-black/10 font-mono text-[11px]">
                  https://github.com/votre-compte/repo/releases/download/v1.0.0/mon-app.apk
                </div>
              </div>

              {/* 3 Step Deployment process */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                  Comment déployer la mise à jour en 3 étapes :
                </h4>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                  <span className="w-5 h-5 rounded-full bg-[#0071e3] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <strong>Remplissez le formulaire</strong> et cliquez sur <strong>Copier le JSON</strong> dans l'onglet 2.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                  <span className="w-5 h-5 rounded-full bg-[#0071e3] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <strong>Ouvrez <code>src/data/apps.json</code></strong> et collez votre nouveau bloc d'application.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                  <span className="w-5 h-5 rounded-full bg-[#0071e3] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div>
                    <strong>Poussez sur GitHub :</strong>
                    <code className="block mt-1 font-mono text-[11px] bg-black/10 dark:bg-black/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                      git add . && git commit -m "Ajout de Mon App" && git push
                    </code>
                    Vercel recompile et met à jour votre site automatiquement en 15 secondes ! 🚀
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
          {activeView === 'form' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => setActiveView('json')}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-all shadow-sm cursor-pointer"
              >
                <span>Générer le code JSON</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveView('form')}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                ← Retour au formulaire
              </button>
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-all shadow-sm cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copié dans le presse-papier !' : 'Copier le code JSON'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
