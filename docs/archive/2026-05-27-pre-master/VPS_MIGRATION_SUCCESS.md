# VPS Migration Success

- Install command: `npm install -g @openai/codex`
- PATH setup: `export PATH="$HOME/.local/node-v22.22.3-linux-x64/bin:$HOME/.local/bin:$PATH"`
- Codex CLI version: `codex-cli 0.133.0`
- Node.js version: `v22.22.3`
- tmux: `tmux 3.4`, `ai-dev` session name is available.
- Config: `~/.codex/config.toml` created with `/home/pkkatsu/aiboux` trusted.
- Auth note: Codex credentials were not found on the VPS. Run `codex login` in the VPS tmux session, or provide a supported API key environment variable.

VPS常駐環境での自律稼働テスト完了。
