/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_PATH: "https://api.clubearkha.com",
    },
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "alianca-sca.s3.us-west-1.amazonaws.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "alianca-sca.s3.us-east-1.amazonaws.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

module.exports = nextConfig;
