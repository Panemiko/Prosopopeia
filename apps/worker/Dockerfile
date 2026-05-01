# Use Node.js 22 as base
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install LaTeX and other system dependencies
# texlive-latex-base: basic LaTeX
# texlive-latex-recommended: recommended packages
# texlive-latex-extra: titlesec, enumitem, etc.
# texlive-fonts-recommended: basic fonts
# texlive-fonts-extra: carlito and others
# texlive-lang-portuguese: for babel portuguese
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-lang-portuguese \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# --- Builder Stage ---
FROM base AS builder
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build --filter=worker...
RUN pnpm deploy --filter=worker --prod /app/out

# --- Runner Stage ---
FROM base AS runner
WORKDIR /app

# Copy deployed worker from builder
COPY --from=builder /app/out .

# Set environment variables
ENV NODE_ENV=production

# The worker expects to find pdflatex in the PATH, which is already set up in the base image.
# The 'pnpm deploy' command prepares a standalone directory for the worker.
CMD ["node", "dist/index.js"]
