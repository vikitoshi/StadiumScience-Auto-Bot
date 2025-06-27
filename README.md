# Stadium Science Auto Bot

Automated bot for Stadium Science daily journal entries and point collection.

## 📢 Join Our Community

**Join our Telegram channel for the latest airdrop updates and bot releases:**
👉 [Airdrop Insiders](https://t.me/AirdropInsiderID)

## 🚀 Features

- **Automated Daily Journal Entries**: Submit journal entries automatically
- **Point Collection**: Automatically collect daily points (100 points per entry)
- **Multi-Account Support**: Handle multiple accounts simultaneously
- **Proxy Support**: Use proxies for enhanced anonymity
- **Device Randomization**: Randomize device information for each request
- **Firebase Integration**: Automated Firebase installation process
- **Branch.io Integration**: Automated Branch.io install tracking
- **Smart Scheduling**: Automatically runs daily at midnight

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vikitoshi/StadiumScience-Auto-Bot.git
   cd StadiumScience-Auto-Bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create configuration files:**
   - Copy `.env.example` to `.env`
   - Create `proxies.txt` (optional)

## ⚙️ Configuration

### Environment Variables (.env)

Create a `.env` file in the root directory with your account credentials:

```env
# Account 1
EMAIL_1=your_email1@example.com
PASS_1=your_password1

# Account 2
EMAIL_2=your_email2@example.com
PASS_2=your_password2

# Account 3
EMAIL_3=your_email3@example.com
PASS_3=your_password3

# Add more accounts as needed...
```

### Proxy Configuration (Optional)

Create a `proxies.txt` file with your proxy list (one per line):

```
http://username:password@proxy1.com:8080
http://username:password@proxy2.com:8080
socks5://username:password@proxy3.com:1080
```

**Proxy formats supported:**
- HTTP: `http://username:password@host:port`
- HTTPS: `https://username:password@host:port`
- SOCKS5: `socks5://username:password@host:port`

## 🚀 Usage

### Run the bot:
```bash
node index.js
```

## 📊 Features Breakdown

### 🔐 Authentication
- Automated login with Firebase token integration
- Secure credential management via environment variables

### 📝 Journal Management
- Fetches daily journal questions automatically
- Provides randomized answers based on question types
- Handles conditional questions (depends_on logic)
- Adds random notes to entries

### 🎯 Point System
- Automatically submits daily points (100 points per entry)
- Tracks point collection with detailed logging

### 🔄 Device Randomization
- Random device brands (XiaoMi, Samsung, Google, OnePlus)
- Random Android versions and build IDs
- Random screen resolutions and specifications
- Random network carriers and connection types

### 🌐 Network Features
- HTTP/2 support for faster requests
- Proxy rotation for enhanced anonymity
- Comprehensive error handling and retry logic

## 📱 Supported Platforms

- **Android Devices**: Emulates various Android devices
- **Multiple Carriers**: FarEasTone, Verizon, AT&T, T-Mobile
- **Locales**: en_US, en_GB, es_US, fr_FR

## 📈 Logging

The bot provides detailed logging with color-coded messages:
- ✅ **Success**: Green messages for completed actions
- ⚠️ **Warning**: Yellow messages for warnings
- ❌ **Error**: Red messages for errors
- 🔄 **Loading**: Cyan messages for ongoing processes
- ➤ **Step**: White messages for process steps

## 🔧 Troubleshooting

### Common Issues:

1. **"No credentials found in .env"**
   - Make sure your `.env` file exists and contains EMAIL_X and PASS_X variables

2. **"Failed to load proxies.txt"**
   - Create an empty `proxies.txt` file or add valid proxy addresses

3. **Login failures**
   - Verify your email and password are correct
   - Check if your account is not banned or restricted

4. **Network errors**
   - Try using different proxies
   - Check your internet connection

## 📅 Scheduling

The bot automatically schedules the next run at midnight (00:00) each day. You can modify the scheduling logic in the `startCountdown()` function.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Disclaimer

This bot is for educational purposes only. Use at your own risk and make sure to comply with Stadium Science's terms of service. The developers are not responsible for any consequences resulting from the use of this bot.

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/vikitoshi/StadiumScience-Auto-Bot/issues)
- **Telegram**: Join our [Airdrop Insiders](https://t.me/AirdropInsiderID) channel for support and updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] GUI interface for easier configuration
- [ ] Advanced scheduling options
- [ ] Statistics dashboard
- [ ] Mobile app companion
- [ ] Multi-language support

---

**⭐ If this bot helped you, please star the repository and join our [Telegram channel](https://t.me/AirdropInsiderID)!**