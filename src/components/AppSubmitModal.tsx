import React, { useState } from 'react';
import { 
  X, Copy, Check, Sparkles, Download, Plus, Trash2, 
  HelpCircle, Code2, ChevronRight 
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
  const [iconUrl, setIconUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&h=256&fit=crop&q=80');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop&q=80');
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
      url: 'https://github.com/votre-compte/votre-repo/releases/download/v1.0.0/App.apk',
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
      url: 'https://github.com/votre-compte/votre-repo/releases/download/v1.0.0/App-Setup.exe',
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
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-[#f5f5f7] rounded-3xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/15 my-auto z-10 max-h-[92vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#0071e3] to-[#5856d6] text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Générateur d'Application pour GitHub
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Créez le bloc JSON à coller dans <code>src/data/apps.json</code> pour ajouter votre appli
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
            <span>3. Tuto GitHub &amp; Vercel (30s)</span>
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
                    Identifiant unique (slug URL)
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
                  placeholder="Présentation des atouts, technologies utilisées, utilité pour l'utilisateur..."
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
                    className="w-full px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
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
                    placeholder="Ex: Nouveau"
                    className="w-full px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded text-[#0071e3] focus:ring-[#0071e3] w-4 h-4"
                    />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">À la une</span>
                  </label>
                </div>
              </div>

              {/* Icons & Media */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    URL de l'icône (256x256)
                  </label>
                  <input
                    type="text"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    placeholder="https://... ou /icons/app.png"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    URL Bannière / Capture
                  </label>
                  <input
                    type="text"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://... ou /banners/app.jpg"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700 dark:text-gray-300">
                  Points forts / Fonctionnalités
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
                  <label className="block font-semibold text-gray-700 dark:text-gray-300">
                    Fichiers téléchargeables (GitHub Releases, APK, EXE...)
                  </label>
                  <button
                    type="button"
                    onClick={addDownload}
                    className="text-xs text-[#0071e3] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter un fichier / miroir</span>
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

                      <input
                        type="text"
                        value={dl.url}
                        onChange={(e) => updateDownload(idx, 'url', e.target.value)}
                        placeholder="Lien direct de téléchargement (ex: https://github.com/.../app.apk)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 font-mono text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Repo */}
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Lien GitHub du projet (Optionnel)
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
                    className="px-4 py-1.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold flex items-center gap-1.5 shadow-sm"
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
              <div className="p-4 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 text-[#0071e3] dark:text-[#2997ff] flex items-center gap-3">
                <GithubIcon className="w-6 h-6 shrink-0" />
                <div>
                  <strong>Hébergement gratuit &amp; illimité :</strong> GitHub Releases vous permet d'héberger vos fichiers APK et EXE jusqu'à 2 Go par fichier sans payer aucun serveur !
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                      Uploadez votre .apk ou .exe sur GitHub Releases
                    </h4>
                    <p className="leading-relaxed">
                      Sur le dépôt GitHub de votre projet, cliquez sur <strong>Releases &gt; Create a new release</strong>, donnez un tag (ex: <code>v1.0.0</code>) et glissez-déposez votre fichier <code>.apk</code> ou <code>.exe</code>.
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      Lien direct généré : https://github.com/votre-compte/repo/releases/download/v1.0.0/mon-app.apk
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                      Ajoutez les informations dans le fichier <code>src/data/apps.json</code>
                    </h4>
                    <p className="leading-relaxed">
                      Remplissez l'onglet <strong>1. Formulaire</strong> de cette fenêtre, cliquez sur <strong>Copier le JSON</strong>, puis collez ce bloc dans la liste <code>src/data/apps.json</code> de votre projet.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                      Poussez sur GitHub (Déploiement automatique sur Vercel)
                    </h4>
                    <p className="leading-relaxed">
                      Faites simplement un commit : <code>git commit -am "Ajout de Mon App" &amp;&amp; git push</code>.<br />
                      Vercel détecte instantanément la mise à jour et met le site en ligne en 15 secondes !
                    </p>
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
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-all shadow-sm"
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
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                ← Retour au formulaire
              </button>
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-all shadow-sm"
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
