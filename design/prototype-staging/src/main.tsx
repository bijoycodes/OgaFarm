import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './shared/styles/tokens.css';
import './shared/styles/base.css';
import './shared/styles/components.css';
import './shared/styles/layouts.css';
import { ProtoApp } from './app/ProtoApp';

createRoot(document.getElementById('root')!).render(<StrictMode><ProtoApp /></StrictMode>);
