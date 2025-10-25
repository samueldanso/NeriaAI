# Neria AI Web App

## 🚀 Quick Start

1. **Clone the repository**

    ```bash
    git clone https://github.com/samueldanso/NeriaAI.git
    cd NeriaAI
    ```

2. **Install dependencies**

    ```bash
    bun install
    ```

3. **Set up environment variables**

    ```bash
    cp .env-example .env
    ```

    Fill in your environment variables in `.env.local`:

    **Required Variables:**

    - `NEXT_PUBLIC_PRIVY_APP_ID`: Get from [Privy Dashboard](https://dashboard.privy.io/)
    - `NEXT_PUBLIC_CHAIN_ID`: Use `84532` for Base Sepolia or `8453` for Base Mainnet
    - `NEXT_PUBLIC_CONTRACT_ADDRESS`: `0x7fb9aB53bFA8E923C0A1aEacbDEAd3d1bD8A0357`
    - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
    - `PINATA_JWT`: Your Pinata JWT token
    - `NEXT_PUBLIC_GATEWAY_URL`: Your Pinata gateway URL

4. **Start development server**

    ```bash
    bun run dev
    ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

## 📚 Documentation

-   [Next.js Documentation](https://nextjs.org/docs)
-   [Wagmi Documentation](https://wagmi.sh)
-   [Privy Documentation](https://docs.privy.io/basics/react/installation)
-   [Shadcn/ui Documentation](https://ui.shadcn.com)
