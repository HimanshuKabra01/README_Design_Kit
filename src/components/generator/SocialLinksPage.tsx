
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Share2, Github, Linkedin, Twitter, Instagram, Youtube, Facebook, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { GeneratorState } from './Readme-generator';
import ProgressIndicator from './ProgressIndicator';

interface SocialLinksPageProps {
  state: GeneratorState;
  setState: (state: GeneratorState) => void;
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
}

const SocialLinksPage = ({ state, setState, currentPage, totalPages, nextPage, prevPage }: SocialLinksPageProps) => {
  const updateSocialLink = (field: keyof typeof state.socialLinks, value: string) => {
    setState({
      ...state,
      socialLinks: {
        ...state.socialLinks,
        [field]: value,
      },
    });
  };

  const socialPlatforms = [
    { key: 'linkedin' as const, label: 'LinkedIn Username', icon: Linkedin, placeholder: 'your-linkedin-username', color: 'from-blue-600 to-blue-500' },
    { key: 'x' as const, label: 'X (Twitter) Username', icon: Twitter, placeholder: 'yourusername', color: 'from-slate-600 to-slate-500' },
    { key: 'instagram' as const, label: 'Instagram Username', icon: Instagram, placeholder: 'yourusername', color: 'from-pink-600 to-purple-500' },
    { key: 'youtube' as const, label: 'YouTube Channel ID', icon: Youtube, placeholder: 'UCyourchanelid', color: 'from-red-600 to-red-500' },
    { key: 'facebook' as const, label: 'Facebook Username', icon: Facebook, placeholder: 'yourusername', color: 'from-blue-700 to-blue-600' },
    { key: 'discord' as const, label: 'Discord Invite Code', icon: MessageCircle, placeholder: 'yourinvitecode', color: 'from-indigo-600 to-indigo-500' },
    { key: 'medium' as const, label: 'Medium Username', icon: Github, placeholder: '@yourusername', color: 'from-slate-700 to-slate-600' },
  
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <ProgressIndicator current={currentPage} total={totalPages - 1} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-foreground px-4 py-2 rounded-full mb-4 text-sm font-medium">
              <Share2 className="w-4 h-4" />
              Social Links
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-primary bg-clip-text text-transparent">
              Add Your Social Links
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect with your audience by adding your social media profiles and professional networks.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {socialPlatforms.map((platform, index) => (
              <motion.div
                key={platform.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${platform.color} opacity-0 group-hover:opacity-10 rounded-xl blur-sm transition-opacity`}></div>
                  <div className="relative bg-background/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${platform.color} rounded-full flex items-center justify-center`}>
                        <platform.icon className="w-5 h-5 text-white" />
                      </div>
                      <Label className="font-medium text-foreground">{platform.label}</Label>
                    </div>
                    <Input
                      placeholder={platform.placeholder}
                      value={state.socialLinks[platform.key]}
                      onChange={(e) => updateSocialLink(platform.key, e.target.value)}
                      className="bg-background/50 border-slate-600 text-muted-foreground placeholder:text-slate-400 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button
              onClick={prevPage}
              variant="outline"
              className="flex items-center gap-2 border-slate-600 text-foreground hover:text-foreground/90 hover:border-slate-500"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>

            <Button
              onClick={nextPage}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksPage;
