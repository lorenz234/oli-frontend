// constants/projectDescriptions.ts
export const PROJECT_DESCRIPTIONS = {
    project_name: "The unique identifier for your project. Use only lowercase letters, numbers, and dashes. This will be used as the filename for your YAML file.",
    display_name: "The human-readable name of your project that will be displayed in interfaces and documentation.",
    description: "A brief description of what your project does and its purpose. Try to be concise but informative.",
    websites: "Official website URLs for your project. Include the full URL starting with http:// or https://.",
    twitter: "Twitter/X account URL for your project, starting with https://x.com/ or https://twitter.com/.",
    telegram: "Telegram channel or group URL for your project, starting with https://t.me/.",
    discord: "Discord server invite link for your project, starting with https://discord.com/invite/ or https://discord.gg/.",
    github: "GitHub organization or repository URLs for your project. For organizations, all repositories will be automatically included.",
    npm: "NPM package URLs for your project, starting with https://www.npmjs.com/package/.",
    crates: "Rust crates package URLs for your project, starting with https://crates.io/crates/.",
    pypi: "Python package URLs for your project, starting with https://pypi.org/project/.",
    go: "Go module URLs for your project, starting with https://pkg.go.dev/.",
    open_collective: "The Open Collective URL for your project if applicable.",
    defillama: "DefiLlama URLs for your project if applicable.",
    comments: "Any additional notes or information that might be helpful for maintainers."
  } as const;