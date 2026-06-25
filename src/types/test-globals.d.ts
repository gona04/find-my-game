declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void | Promise<void>) => void;
declare const beforeEach: (fn: () => void) => void;
declare const expect: any;
declare const jest: any;
declare const global: any;
declare namespace jest { type Mock = any; }
declare module '@testing-library/react-native' { export const render: any; export const renderHook: any; export const act: any; }
declare module 'react-native-svg' { export type SvgProps = Record<string, unknown>; }
declare module 'react-native-safe-area-context' { import React from 'react'; export const SafeAreaProvider: React.FC<React.PropsWithChildren<object>>; }
