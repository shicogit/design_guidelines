import { FONT, COLOR, Med, Lead, Hero } from './brandKit';
import { MelAnim, melioUrl } from './IllustrationsGuidelines';

const MONO = '"SFMono-Regular", ui-monospace, Menlo, Consolas, monospace';
const PURPLE = COLOR.purple;
const PENNY_DOCS = 'https://penny.melio.com/?path=/docs/foundations-illustration--docs';

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre
      style={{
        background: COLOR.panel,
        border: `1px solid ${COLOR.cardBorder}`,
        borderRadius: 10,
        padding: '12px 14px',
        margin: '10px 0',
        fontFamily: MONO,
        fontSize: 14,
        lineHeight: 1.55,
        color: COLOR.ink,
        overflowX: 'auto',
        whiteSpace: 'pre',
      }}
    >
      {children}
    </pre>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 20, fontWeight: 600, margin: '28px 0 6px' }}>{children}</h2>;
}

const P: React.CSSProperties = { fontSize: 14, lineHeight: 1.7, color: COLOR.body, margin: '0 0 10px' };

export function IllustrationsDevelopers() {
  return (
    <div style={{ fontFamily: FONT, color: COLOR.ink, maxWidth: 760 }}>
      <Hero
        title="How do I implement an illustration?"
        visual={<MelAnim url={melioUrl('product')} size={200} />}
      >
        <Lead style={{ margin: 0 }}>
          How illustrations are wired up - the built-in Penny set and custom assets, with how to override them.
        </Lead>
      </Hero>
      <p style={{ ...P, marginTop: 8 }}>There are two types of illustration implementation:</p>
      <ol style={{ ...P, paddingLeft: 22 }}>
        <li><Med>Penny illustrations</Med> - the built-in set in Penny's <code style={{ fontFamily: MONO }}>&lt;Illustration&gt;</code> component.</li>
        <li><Med>Custom illustrations</Med> - anything implemented outside Penny.</li>
      </ol>

      {/* Penny illustrations */}
      <H>Penny illustrations</H>
      <p style={P}>
        These illustrations have types that are part of the <code style={{ fontFamily: MONO }}>&lt;Illustration&gt;</code>{' '}
        component in Penny.
      </p>
      <Code>{`<Illustration type="new-email" ... />`}</Code>
      <p style={P}>
        This sets the default Penny illustration for the specified type - see the full list in the{' '}
        <a href={PENNY_DOCS} target="_blank" rel="noreferrer" style={{ color: PURPLE, fontWeight: 500 }}>
          Penny Illustration docs
        </a>
        .
      </p>

      <H>Penny illustration overrides</H>
      <p style={P}>
        You can override an illustration by setting a value in the relevant partner theme. For example:
      </p>
      <Code>{`'new-email': {
  src: \`\${MELIO_ASSETS_BASE_URL}/new-email.lottie.json\`,
  type: 'animation',
  loop: false,
},`}</Code>
      <p style={P}>
        Like any partner configuration (including Melio), this is managed by the Partners teams. The theme is defined
        in the <Med>theme-configuration</Med>. Overriding an illustration takes two steps:
      </p>
      <ol style={{ ...P, paddingLeft: 22 }}>
        <li style={{ marginBottom: 6 }}>
          <Med>Upload the illustration</Med> to the relevant partner folder in S3:{' '}
          <code style={{ fontFamily: MONO }}>
            s3://platform-static.meliopayments.com/assets/&#123;partner-name&#125;
          </code>
          <div style={{ color: COLOR.muted, marginTop: 2 }}>Can be done by any dev in any team.</div>
        </li>
        <li>
          <Med>Update the configuration</Med> to add/update this value.
        </li>
      </ol>

      {/* Custom (non-Penny) illustrations */}
      <H>Custom illustrations</H>
      <p style={P}>
        For illustrations implemented outside of Penny, you decide on the implementation. Generally you should:
      </p>
      <ol style={{ ...P, paddingLeft: 22 }}>
        <li style={{ marginBottom: 6 }}>
          Upload the illustration (SVG, Lottie) to S3 - you can use the same bucket if you want.
        </li>
        <li>Add the code to point to that asset URL.</li>
      </ol>

      <p style={{ fontSize: 14, color: COLOR.faint, margin: '24px 0 0' }}>
        Source: platform team notes (Omer Baki). Confirm details with the Partners team before shipping.
      </p>
    </div>
  );
}
