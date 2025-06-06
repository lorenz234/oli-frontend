import React from 'react';
import InputWithCheck from '../../attestation/InputWithCheck';

interface SocialSectionProps {
  formData: any;
  errors: { [key: string]: string };
  handleSocialChange: (platform: 'twitter' | 'telegram' | 'discord', index: number, value: string) => void;
  removeSocial: (platform: 'twitter' | 'telegram' | 'discord', index: number) => void;
  PROJECT_DESCRIPTIONS: Record<string, string>;
}

const Tooltip = ({ content }: { content: string }) => (
  <div className="group relative inline-block ml-2">
    <svg 
      className="w-4 h-4 text-gray-400 hover:text-gray-500" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
    <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-sm text-gray-600 bg-white border rounded-lg shadow-lg -left-1/2 transform -translate-x-1/2">
      {content}
    </div>
  </div>
);

const SocialSection: React.FC<SocialSectionProps> = ({
  formData,
  errors,
  handleSocialChange,
  removeSocial,
  PROJECT_DESCRIPTIONS,
}) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media</h3>
    {/* Twitter */}
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
          Twitter
        </label>
        <Tooltip content={PROJECT_DESCRIPTIONS['twitter'] || 'Twitter/X account URLs'} />
      </div>
      <div className="space-y-2">
        {formData.social.twitter.map((twitter: { url: string }, index: number) => (
          <div key={`twitter-${index}`} className="flex items-center gap-2">
            <div className="w-full max-w-md">
              <InputWithCheck
                value={!!twitter.url}
                isValid={!errors[`twitter_${index}`]}
                error={errors[`twitter_${index}`]}
              >
                <input
                  type="url"
                  id={`twitter-${index}`}
                  name={`twitter-${index}`}
                  value={twitter.url}
                  onChange={e => handleSocialChange('twitter', index, e.target.value)}
                  placeholder="https://x.com/username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
            </div>
            {index > 0 && twitter.url === '' && formData.social.twitter.length > 1 && (
              <button
                type="button"
                onClick={() => removeSocial('twitter', index)}
                className="p-1 text-red-500 hover:text-red-700"
                aria-label="Remove Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
    {/* Telegram */}
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
          Telegram
        </label>
        <Tooltip content={PROJECT_DESCRIPTIONS['telegram'] || 'Telegram channel or group URLs'} />
      </div>
      <div className="space-y-2">
        {formData.social.telegram.map((telegram: { url: string }, index: number) => (
          <div key={`telegram-${index}`} className="flex items-center gap-2">
            <div className="w-full max-w-md">
              <InputWithCheck
                value={!!telegram.url}
                isValid={!errors[`telegram_${index}`]}
                error={errors[`telegram_${index}`]}
              >
                <input
                  type="url"
                  id={`telegram-${index}`}
                  name={`telegram-${index}`}
                  value={telegram.url}
                  onChange={e => handleSocialChange('telegram', index, e.target.value)}
                  placeholder="https://t.me/username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
            </div>
            {index > 0 && telegram.url === '' && formData.social.telegram.length > 1 && (
              <button
                type="button"
                onClick={() => removeSocial('telegram', index)}
                className="p-1 text-red-500 hover:text-red-700"
                aria-label="Remove Telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
    {/* Discord */}
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor="discord" className="block text-sm font-medium text-gray-700">
          Discord
        </label>
        <Tooltip content={PROJECT_DESCRIPTIONS['discord'] || 'Discord server invite links'} />
      </div>
      <div className="space-y-2">
        {formData.social.discord.map((discord: { url: string }, index: number) => (
          <div key={`discord-${index}`} className="flex items-center gap-2">
            <div className="w-full max-w-md">
              <InputWithCheck
                value={!!discord.url}
                isValid={!errors[`discord_${index}`]}
                error={errors[`discord_${index}`]}
              >
                <input
                  type="url"
                  id={`discord-${index}`}
                  name={`discord-${index}`}
                  value={discord.url}
                  onChange={e => handleSocialChange('discord', index, e.target.value)}
                  placeholder="https://discord.com/invite/..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
            </div>
            {index > 0 && discord.url === '' && formData.social.discord.length > 1 && (
              <button
                type="button"
                onClick={() => removeSocial('discord', index)}
                className="p-1 text-red-500 hover:text-red-700"
                aria-label="Remove Discord"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SocialSection; 