import nextra from 'nextra'

const withNextra = nextra({
  search: { codeblocks: false },
  defaultShowCopyCode: true
})

export default withNextra({
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx'
    }
  }
})
