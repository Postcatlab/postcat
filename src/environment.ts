const variables = {
  GITHUB_ORANIZATION_NAME: 'postcatlab',
  GITHUB_PROJECT_NAME: 'postcat'
};
export const COMMON_APP_CONFIG = {
  // EXTENSION_URL: 'http://localhost:5000',
  EXTENSION_URL: 'https://extensions.postcat.com',
  REMOTE_SOCKET_URL: 'wss://postcat.com',
  // SOCKET_PORT: '',
  // MOCK_URL: 'http://8.219.85.124:5000',
  NODE_SERVER_PORT: 4201,
  GITHUB_ORANIZATION_NAME: variables.GITHUB_ORANIZATION_NAME,
  GITHUB_PROJECT_NAME: variables.GITHUB_PROJECT_NAME,
  GITHUB_REPO_URL: `https://github.com/${variables.GITHUB_ORANIZATION_NAME}/${variables.GITHUB_PROJECT_NAME}`,
  BASE_DOWNLOAD_URL: 'https://data.postcat.com/download/'
  // BASE_DOWNLOAD_URL: 'http://127.0.0.1:8080'
} as const;
