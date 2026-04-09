# Use Bun image
FROM oven/bun:latest AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
# Note: Next.js build needs environment variables if you use them in getStaticProps/etc.
# But for runtime/client-side, NEXT_PUBLIC_ is enough.
RUN bun run build

# Production image
FROM oven/bun:latest AS runner
WORKDIR /app

COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json

EXPOSE 3000

CMD ["bun", "run", "start"]
