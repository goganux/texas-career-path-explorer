import React from 'react';
import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link href="#">
              <div className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 text-sm cursor-pointer">
                Help Center
              </div>
            </Link>
            <Link href="#">
              <div className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 text-sm cursor-pointer">
                Privacy Policy
              </div>
            </Link>
            <Link href="#">
              <div className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 text-sm cursor-pointer">
                Terms of Service
              </div>
            </Link>
            <Link href="#">
              <div className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 text-sm cursor-pointer">
                Contact Support
              </div>
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center md:text-right text-sm text-neutral-500 dark:text-neutral-400">
              &copy; 2025 Softchoice WWT. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
