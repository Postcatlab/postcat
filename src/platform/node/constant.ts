const args = process.argv.slice(1);
export const processEnv = args.some((val) => val === '--serve')
  ? 'serve'
  : args.some((val) => val === '--development')
  ? 'development'
  : 'production';
