import React from 'react';
import { Redirect } from 'wouter';

interface ProfileProps {
  onLogout?: () => void;
}

export default function Profile({ onLogout }: ProfileProps) {
  // Redirect to career explorer page as this is our focus for now
  return <Redirect to="/career-explorer" />;
}
