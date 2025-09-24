// Dynamic SDK hook for sponsored transactions with Coinbase Smart Wallet
import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { isEthereumWallet } from '@dynamic-labs/ethereum';

export interface DynamicSponsorshipCapabilities {
  isSupported: boolean;
  isCoinbaseSmartWallet: boolean;
  canSponsorTransactions: boolean;
  isOnBase: boolean;
}

export const useDynamicSponsorship = () => {
  const { primaryWallet } = useDynamicContext();
  const [capabilities, setCapabilities] = useState<DynamicSponsorshipCapabilities>({
    isSupported: false,
    isCoinbaseSmartWallet: false,
    canSponsorTransactions: false,
    isOnBase: false
  });
  const [actualChainId, setActualChainId] = useState<number | null>(null);

  const walletName = primaryWallet?.connector?.name;
  // More secure wallet detection - check for exact matches
  const isCoinbaseSmartWallet = (
    walletName === 'Coinbase' || 
    walletName === 'Coinbase Smart Wallet' ||
    walletName === 'coinbase_smart_wallet' ||
    walletName?.toLowerCase() === 'coinbase'
  ) || false;

  useEffect(() => {
    const checkChainId = async () => {
      if (!primaryWallet) {
        setActualChainId(null);
        return;
      }

      try {
        // Check if it's an Ethereum wallet before getting client
        if (!isEthereumWallet(primaryWallet)) {
          setActualChainId(null);
          return;
        }
        
        // Get actual chain ID from wallet client
        const walletClient = await primaryWallet.getWalletClient();
        const chainId = await walletClient.getChainId();
        setActualChainId(chainId);
        
        // Debug logging (development only)
        if (process.env.NODE_ENV === 'development') {
          console.log('Dynamic wallet chain info:', {
            chain: primaryWallet?.chain,
            actualChainId: chainId,
            walletName,
            isCoinbaseSmartWallet,
            isBase: chainId === 8453
          });
        }
      } catch (error) {
        // Log error in development, generic message in production
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to get chain ID:', error);
        } else {
          console.error('Failed to get chain ID');
        }
        setActualChainId(null);
      }
    };

    checkChainId();
  }, [primaryWallet, walletName, isCoinbaseSmartWallet]);

  useEffect(() => {
    const checkCapabilities = () => {
      if (!primaryWallet || actualChainId === null) {
        setCapabilities({
          isSupported: false,
          isCoinbaseSmartWallet: false,
          canSponsorTransactions: false,
          isOnBase: false
        });
        return;
      }

      const isOnBase = actualChainId === 8453; // Base chain ID

      setCapabilities({
        isSupported: true,
        isCoinbaseSmartWallet,
        canSponsorTransactions: isCoinbaseSmartWallet && isOnBase,
        isOnBase
      });
    };

    checkCapabilities();
  }, [primaryWallet, isCoinbaseSmartWallet, actualChainId]);

  // Send sponsored transaction using Dynamic's Viem-based approach
  const sendSponsoredTransaction = async (to: string, value: string = '0x0', data: string = '0x') => {
    if (!primaryWallet || !capabilities.canSponsorTransactions) {
      throw new Error('Sponsored transactions not available');
    }

    if (!isEthereumWallet(primaryWallet)) {
      throw new Error('Wallet is not an Ethereum wallet');
    }

    try {
      // Get wallet client using Dynamic's Viem integration
      const walletClient = await primaryWallet.getWalletClient();

      // For Coinbase Smart Wallet on Base, Dynamic handles paymaster integration automatically
      const result = await walletClient.sendTransaction({
        to: to as `0x${string}`,
        value: BigInt(value),
        data: data as `0x${string}`,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('Sponsored transaction sent:', result);
      }
      return result;
    } catch (error) {
      // Log detailed error in development, generic in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Sponsored transaction failed:', error);
        throw error;
      } else {
        console.error('Sponsored transaction failed');
        throw new Error('Transaction failed to process');
      }
    }
  };

  // Get sponsorship status message
  const getSponsorshipMessage = (): string => {
    if (!primaryWallet) {
      return 'Connect wallet to check sponsorship';
    }
    
    if (!isCoinbaseSmartWallet) {
      return 'Use Coinbase Smart Wallet for gas sponsorship';
    }
    
    if (actualChainId === null) {
      return 'Checking network...';
    }
    
    if (actualChainId !== 8453) {
      return `Switch to Base network for gas sponsorship (currently on chain ${actualChainId})`;
    }
    
    return '⚡ Gas fees sponsored by Coinbase Paymaster';
  };

  return {
    capabilities,
    sendSponsoredTransaction,
    getSponsorshipMessage,
    primaryWallet
  };
};
