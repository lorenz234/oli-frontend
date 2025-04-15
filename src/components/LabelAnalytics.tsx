import { gql } from '@apollo/client';

const TAGS_COUNT = gql`
query tag_id_count {
    owner_project: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"owner_project\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    is_eoa: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"is_eoa\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    is_contract: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"is_contract\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    contract_name: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"contract_name\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    is_factory_contract: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"is_factory_contract\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    deployment_tx: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"deployment_tx\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    deployer_address: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"deployer_address\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    deployment_date: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"deployment_date\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    is_proxy: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"is_proxy\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    is_safe_contract: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"is_safe_contract\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    erc_type: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"erc_type\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    erc20_name: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"erc20.name\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    erc20_symbol: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"erc20.symbol\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    erc20_decimals: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"erc20.decimals\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    erc721_name: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"erc721.name\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    erc721_symbol: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"erc721.symbol\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    erc1155_name: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"erc1155.name\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    erc1155_symbol: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"erc1155.symbol\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    usage_category: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"usage_category\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    version: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"version\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    audit: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"audit\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    contract_monitored: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"contract_monitored\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
    
    source_code_verified: aggregateAttestation(
        where: {
        schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
        decodedDataJson: {contains: "\"source_code_verified\\\\\":"},
        revoked: {equals: false}
        }
    ) {
        _count {
        _all
        }
    }
}
`;

const ATTESTATION_CHAIN_DISTRIBUTION = gql`

query tags_per_chain {
  
  base: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:8453\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  blast: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:81457\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  zora: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:7777777\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  redstone: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:690\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  linea: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:59144\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  ink: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:57073\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  scroll: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:534352\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  mantle: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:5000\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  zircuit: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:48900\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  worldchain: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:480\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  arbitrum_nova: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:42170\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  arbitrum: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:42161\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  mode: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:34443\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  zksync_era: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:324\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  fraxtal: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:252\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  swell: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:1923\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  soneium: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:1868\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  mint: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:185\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  manta: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:169\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  taiko: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:167000\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  gravity: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:1625\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  real: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:111188\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  polygon_zkevm: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:1101\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  metis: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:1088\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  optimism: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:10\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  ethereum: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:1\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
  
  unichain: aggregateAttestation(
    where: {
      schemaId: {equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"},
      decodedDataJson: {contains: "\\\"value\\\":\\\"eip155:130\\\""},
      revoked: {equals: false}
    }
  ) {
    _count {
      _all
    }
  }
}

`


// "decodedDataJson": "[{\"name\":\"chain_id\",\"type\":\"string\",\"signature\":\"string chain_id\",\"value\":{\"name\":\"chain_id\",\"type\":\"string\",\"value\":\"eip155:10\"}},{\"name\":\"tags_json\",\"type\":\"string\",\"signature\":\"string tags_json\",\"value\":{\"name\":\"tags_json\",\"type\":\"string\",\"value\":\"{\\\"contract_name\\\":\\\"bankless\\\",\\\"usage_category\\\":\\\"fungible_tokens\\\"}\"}}]",