const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const fs = require('fs').promises;
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const http2 = require('http2-wrapper');

dotenv.config();

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  bold: "\x1b[1m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

const logger = {
  info: (msg) => console.log(`${colors.green}[✓] ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}[⚠] ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}[✗] ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}[✅] ${msg}${colors.reset}`),
  loading: (msg) => console.log(`${colors.cyan}[⟳] ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.white}[➤] ${msg}${colors.reset}`),
  banner: () => {
    console.log(`${colors.cyan}${colors.bold}`);
    console.log('-----------------------------------------------');
    console.log('  Stadium Science Auto Bot - Airdrop Insiders  ');
    console.log('-----------------------------------------------');
    console.log(`${colors.reset}\n`);
  },
};

const userAgents = [
  'okhttp/4.9.2',
  'Dalvik/2.1.0 (Linux; U; Android 12; Redmi Note 8 Pro Build/V417IR)',
  'Dalvik/2.1.0 (Linux; U; Android 13; Pixel 6 Build/TQ3A.230805.001)',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
];

const clientDevices = [
  'supabase-js-react-native/2.49.4',
  'supabase-js-web/2.50.0',
  'supabase-js-android/2.49.4',
];

const deviceBrands = ['XiaoMi', 'Samsung', 'Google', 'OnePlus'];
const deviceModels = ['Redmi Note 8 Pro', 'Galaxy S21', 'Pixel 6', 'OnePlus 9'];
const androidVersions = ['12', '13', '14'];
const buildIds = ['V417IR', 'SP1A.210812.016', 'TQ3A.230805.001', 'OPM1.171019.011'];
const carriers = ['FarEasTone', 'Verizon', 'AT&T', 'T-Mobile'];
const locales = ['en_US', 'en_GB', 'es_US', 'fr_FR'];
const connectionTypes = ['wifi', 'mobile'];

const randomTime = () => {
  const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const randomNotes = () => {
  const notes = ['Feeling great!', 'Need more energy.', 'Good day!', 'Tired but productive.', 'Need more coffee!'];
  return notes[Math.floor(Math.random() * notes.length)];
};

async function loadProxies() {
  try {
    const data = await fs.readFile('proxies.txt', 'utf8');
    const proxies = data.split('\n').filter(line => line.trim() !== '');
    logger.info(`Loaded ${proxies.length} proxies`);
    return proxies;
  } catch (error) {
    logger.error('Failed to load proxies.txt');
    return [];
  }
}

function getRandomProxy(proxies) {
  return proxies[Math.floor(Math.random() * proxies.length)];
}

function loadCredentials() {
  const credentials = [];
  let i = 1;
  while (process.env[`EMAIL_${i}`] && process.env[`PASS_${i}`]) {
    credentials.push({
      email: process.env[`EMAIL_${i}`],
      password: process.env[`PASS_${i}`],
    });
    i++;
  }
  logger.info(`Loaded ${credentials.length} accounts`);
  return credentials;
}

function generateRandomDeviceData() {
  const brand = deviceBrands[Math.floor(Math.random() * deviceBrands.length)];
  const model = deviceModels[Math.floor(Math.random() * deviceModels.length)];
  const osVersion = androidVersions[Math.floor(Math.random() * androidVersions.length)];
  const build = buildIds[Math.floor(Math.random() * buildIds.length)];
  const carrier = carriers[Math.floor(Math.random() * carriers.length)];
  const locale = locales[Math.floor(Math.random() * locales.length)];
  const connection = connectionTypes[Math.floor(Math.random() * connectionTypes.length)];
  return { brand, model, osVersion, build, carrier, locale, connection };
}

async function firebaseInstall(proxy) {
  const url = 'https://firebaseinstallations.googleapis.com/v1/projects/stadium-science-de94d/installations';
  const { brand, model, osVersion, build } = generateRandomDeviceData();
  const headers = {
    'User-Agent': `Dalvik/2.1.0 (Linux; U; Android ${osVersion}; ${model} Build/${build})`,
    'Connection': 'Keep-Alive',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
    'X-Android-Package': 'com.stadiumscience.stadiumapp',
    'x-firebase-client': 'H4sIAAAAAAAAAKtWykhNLCpJSk0sKVayio7VUSpLLSrOzM9TslIyUqoFAFyivEQfAAAA',
    'X-Android-Cert': 'ACC77A847646F34544B21BA10DC4DEA0C8121A9F',
    'x-goog-api-key': 'AIzaSyBun40rW35UOh5p-AvU_-t9CJNaU25be-s',
  };

  const data = {
    fid: uuidv4().replace(/-/g, '').slice(0, 22),
    appId: '1:1016861756561:android:4d6a923755962652e84330',
    authVersion: 'FIS_v2',
    sdkVersion: 'a:17.2.0',
  };

  try {
    logger.loading('Performing Firebase installation');
    const response = await axios.post(url, data, {
      headers,
      httpAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
      httpsAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
    });
    logger.success('Firebase installation successful');
    return response.data.authToken.token;
  } catch (error) {
    logger.error(`Firebase installation failed: ${error.message}`);
    throw error;
  }
}

async function branchInstall(proxy) {
  const url = 'https://api2.branch.io/v1/install';
  const { brand, model, osVersion, build, carrier, locale, connection } = generateRandomDeviceData();
  const headers = {
    'User-Agent': `Dalvik/2.1. deno (Linux; U; Android ${osVersion}; ${model} Build/${build})`,
    'Connection': 'Keep-Alive',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
  };

  const data = {
    hardware_id: uuidv4(),
    is_hardware_id_real: false,
    anon_id: uuidv4(),
    brand,
    model,
    screen_dpi: Math.floor(Math.random() * (800 - 320) + 320),
    screen_height: Math.floor(Math.random() * (3200 - 720) + 720),
    screen_width: Math.floor(Math.random() * (1920 - 360) + 360),
    wifi: connection === 'wifi',
    ui_mode: 'UI_MODE_TYPE_NORMAL',
    os: 'Android',
    os_version: parseInt(osVersion),
    plugin_name: 'ReactNative',
    plugin_version: '6.7.1',
    country: locale.split('_')[1] || 'US',
    language: locale.split('_')[0] || 'en',
    local_ip: `10.1.10.${Math.floor(Math.random() * 255)}`,
    cpu_type: 'aarch64',
    build: `${build} release-keys`,
    locale,
    connection_type: connection,
    device_carrier: carrier,
    os_version_android: osVersion,
    debug: false,
    partner_data: {},
    app_version: '2.2.9',
    update: 0,
    latest_install_time: Date.now(),
    latest_update_time: Date.now(),
    first_install_time: Date.now(),
    previous_update_time: 0,
    environment: 'FULL_APP',
    initial_referrer: 'android-app://com.mumu.launcher',
    install_begin_ts: Math.floor(Date.now() / 1000),
    install_begin_server_ts: Math.floor(Date.now() / 1000) + 1,
    metadata: {},
    branch_sdk_request_timestamp: Date.now(),
    branch_sdk_request_unique_id: `${uuidv4()}-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`,
    install_referrer_extras: 'utm_source=google-play&utm_medium=organic',
    app_store: 'PlayStore',
    advertising_ids: { aaid: uuidv4() },
    lat_val: 0,
    google_advertising_id: uuidv4(),
    sdk: 'android5.18.1',
    branch_key: 'key_live_cDqcumONscNa18FEZqNG0plfBFd17VAP',
    retryNumber: 0,
  };

  try {
    logger.loading('Performing Branch.io install');
    const response = await axios.post(url, data, {
      headers,
      httpAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
      httpsAgent: proxy ? new Https |Agent(proxy) : undefined,
    });
    logger.success('Branch.io install successful');
    return response.data;
  } catch (error) {
    logger.error(`Branch.io install failed: ${error.message}`);
    throw error;
  }
}

async function login(email, password, proxy, firebaseToken) {
  const url = 'https://ugufnspofxridfdowfov.supabase.co/auth/v1/token?grant_type=password';
  const { osVersion, model, build } = generateRandomDeviceData();
  const headers = {
    'User-Agent': `Dalvik/2.1.0 (Linux; U; Android ${osVersion}; ${model} Build/${build})`,
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json;charset=UTF-8',
    'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWZuc3BvZnhyaWRmZG93Zm92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNTY4OTM3MiwiZXhwIjoyMDIxMjY1MzcyfQ.aP7tBT9mNFeSUOn3rs3vs776aVor9AV7jURq0pWcN-U',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWZuc3BvZnhyaWRmZG93Zm92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNTY4OTM3MiwiZXhwIjoyMDIxMjY1MzcyfQ.aP7tBT9mNFeSUOn3rs3vs776aVor9AV7jURq0pWcN-U',
    'x-client-info': clientDevices[Math.floor(Math.random() * clientDevices.length)],
    'x-supabase-api-version': '2024-01-01',
  };

  const data = {
    email,
    password,
    gotrue_meta_security: {
      firebase_token: firebaseToken,
    },
  };

  try {
    logger.loading(`Logging in for ${email}`);
    const response = await axios.post(url, data, {
      headers,
      httpAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
      httpsAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
      http2: true, 
    });
    logger.success(`Login successful for ${email}`);
    return response.data;
  } catch (error) {
    logger.error(`Login failed for ${email}: ${error.message}`);
    if (error.response) {
      logger.error(`Response status: ${error.response.status}`);
      logger.error(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    throw error;
  }
}

async function fetchJournalQuestions(accessToken, proxy) {
  const url = 'https://ugufnspofxridfdowfov.supabase.co/rest/v1/journal_questions?select=*';
  const { osVersion, model, build } = generateRandomDeviceData();
  const headers = {
    'User-Agent': `Dalvik/2.1.0 (Linux; U; Android ${osVersion}; ${model} Build/${build})`,
    'Accept-Encoding': 'gzip',
    'x-client-info': clientDevices[Math.floor(Math.random() * clientDevices.length)],
    'accept-profile': 'public',
    'authorization': `Bearer ${accessToken}`,
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWZuc3BvZnhyaWRmZG93Zm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2ODkzNzIsImV4cCI6MjAyMTI2NTM3Mn0.47gTlkt3x2icsDg7kO-Pzoyo9T8w_9yiz-P3JyTUj6c',
    'Cookie': '__cf_bm=yIRdqTOiefLlxMKFrbWwenVGe64n5M2S_l_ttE86INc-1750999515-1.0.1.1-C0AhnnUQzdtp.Fm3tFHQyLlzoWRkqJ_pJidGrNq4SMkbTIeMTqEeRxYocI9zLQFn29f7M8dLR2W2C_v7w3Po8meFRNYn.eOxefA3UvIa_1Q',
  };

  try {
    logger.loading('Fetching journal questions');
    const response = await axios.get(url, {
      headers,
      httpAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
      httpsAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
      http2: true,
    });
    logger.success('Journal questions fetched');
    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch journal questions: ${error.message}`);
    if (error.response) {
      logger.error(`Response status: ${error.response.status}`);
      logger.error(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    throw error;
  }
}

async function submitJournalEntry(userId, accessToken, questions, proxy) {
  const url = 'https://ugufnspofxridfdowfov.supabase.co/rest/v1/journal_entries?columns=%22user_id%22,%22answers%22';
  const { osVersion, model, build } = generateRandomDeviceData();
  const headers = {
    'User-Agent': `Dalvik/2.1.0 (Linux; U; Android ${osVersion}; ${model} Build/${build})`,
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
    'x-client-info': clientDevices[Math.floor(Math.random() * clientDevices.length)],
    'prefer': '',
    'content-profile': 'public',
    'authorization': `Bearer ${accessToken}`,
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWZuc3BvZnhyaWRmZG93Zm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2ODkzNzIsImV4cCI6MjAyMTI2NTM3Mn0.47gTlkt3x2icsDg7kO-Pzoyo9T8w_9yiz-P3JyTUj6c',
    'Cookie': '__cf_bm=yIRdqTOiefLlxMKFrbWwenVGe64n5M2S_l_ttE86INc-1750999515-1.0.1.1-C0AhnnUQzdtp.Fm3tFHQyLlzoWRkqJ_pJidGrNq4SMkbTIeMTqEeRxYocI9zLQFn29f7M8dLR2W2C_v7w3Po8meFRNYn.eOxefA3UvIa_1Q',
  };

  const answers = questions.map(question => {
    let answer;
    if (question.type === 'time') {
      answer = randomTime();
    } else if (question.type === 'yes/no') {
      answer = Math.random() > 0.5;
    }
    return {
      question: question.question,
      question_id: question.id,
      type: question.type,
      answer,
    };
  }).filter((answer, index, arr) => {
    const question = questions[index];
    if (question.depends_on) {
      const parent = arr.find(a => a.question_id === question.depends_on);
      return parent && parent.answer === question.depends_on_value;
    }
    return true;
  });

  const data = [{
    user_id: userId,
    answers: {
      answers,
      notes: randomNotes(),
    },
  }];

  try {
    logger.loading('Submitting journal entry');
    await axios.post(url, data, {
      headers,
      httpAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
      httpsAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
      http2: true,
    });
    logger.success('Journal entry submitted');
  } catch (error) {
    logger.error(`Failed to submit journal entry: ${error.message}`);
    if (error.response) {
      logger.error(`Response status: ${error.response.status}`);
      logger.error(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    throw error;
  }
}

async function submitUserPoints(userId, accessToken, proxy) {
  const url = 'https://ugufnspofxridfdowfov.supabase.co/rest/v1/user_points_records';
  const { osVersion, model, build } = generateRandomDeviceData();
  const headers = {
    'User-Agent': `Dalvik/2.1.0 (Linux; U; Android ${osVersion}; ${model} Build/${build})`,
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
    'x-client-info': clientDevices[Math.floor(Math.random() * clientDevices.length)],
    'prefer': '',
    'content-profile': 'public',
    'authorization': `Bearer ${accessToken}`,
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndWZuc3BvZnhyaWRmZG93Zm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2ODkzNzIsImV4cCI6MjAyMTI2NTM3Mn0.47gTlkt3x2icsDg7kO-Pzoyo9T8w_9yiz-P3JyTUj6c',
    'Cookie': '__cf_bm=yIRdqTOiefLlxMKFrbWwenVGe64n5M2S_l_ttE86INc-1750999515-1.0.1.1-C0AhnnUQzdtp.Fm3tFHQyLlzoWRkqJ_pJidGrNq4SMkbTIeMTqEeRxYocI9zLQFn29f7M8dLR2W2C_v7w3Po8meFRNYn.eOxefA3UvIa_1Q',
  };

  const data = {
    user_id: userId,
    description: 'Daily Journal Entry',
    amount: 100,
    date: new Date().toISOString().split('T')[0],
  };

  try {
    logger.loading('Submitting user points');
    await axios.post(url, data, {
      headers,
      httpAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
      httpsAgent: proxy ? new HttpsProxyAgent(proxy) : undefined,
      http2: true,
    });
    logger.success('User points submitted');
  } catch (error) {
    logger.error(`Failed to submit user points: ${error.message}`);
    if (error.response) {
      logger.error(`Response status: ${error.response.status}`);
      logger.error(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    throw error;
  }
}

function startCountdown() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const timeUntilMidnight = tomorrow - now;

  logger.info(`Next run in ${Math.floor(timeUntilMidnight / 1000 / 60 / 60)} hours ${Math.floor((timeUntilMidnight / 1000 / 60) % 60)} minutes`);

  setTimeout(async () => {
    await main();
    startCountdown();
  }, timeUntilMidnight);
}

async function main() {
  logger.banner();
  const proxies = await loadProxies();
  const credentials = loadCredentials();

  if (!credentials.length) {
    logger.error('No credentials found in .env');
    return;
  }

  for (const { email, password } of credentials) {
    logger.step(`Processing account: ${email}\n`);
    logger.info(`Using credentials - Email: ${email}`);
    const proxy = proxies.length ? getRandomProxy(proxies) : null;
    if (proxy) logger.info(`Using proxy: ${proxy}`);

    try {
      const firebaseToken = await firebaseInstall(proxy);

      const branchData = await branchInstall(proxy);
      logger.info(`Branch randomized_device_token: ${branchData.randomized_device_token}`);

      const loginData = await login(email, password, proxy, firebaseToken);
      const { access_token, user } = loginData;
      const userId = user.id;

      const questions = await fetchJournalQuestions(access_token, proxy);

      await submitJournalEntry(userId, access_token, questions, proxy);

      await submitUserPoints(userId, access_token, proxy);

      logger.success(`Completed processing for ${email}`);
    } catch (error) {
      logger.error(`Error processing ${email}: ${error.message}`);
    }
  }
}

main().then(() => startCountdown());