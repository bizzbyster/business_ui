'use client';

import { useState } from 'react';
import { Box, IconButton, Typography, Paper } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

export default function CodeSnippet({ 
  code, 
  label 
}: { 
  code: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      <Paper 
        sx={{ 
          p: 2,
          bgcolor: '#f5f5f5',
          position: 'relative',
          fontFamily: 'monospace',
          '&:hover .copy-button': {
            opacity: 1
          }
        }}
      >
        <IconButton
          onClick={handleCopy}
          className="copy-button"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            opacity: 0,
            transition: 'opacity 0.2s',
            bgcolor: 'background.paper'
          }}
        >
          {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
        </IconButton>
        <pre style={{ margin: 0, overflow: 'auto' }}>
          <code>{code}</code>
        </pre>
      </Paper>
    </Box>
  );
} 
