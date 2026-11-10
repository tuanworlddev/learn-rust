import type { ReactNode } from "react";

const RUST_TOKENS = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|r#*"[\s\S]*?"#*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])'|\b(?:fn|let|mut|pub|use|mod|struct|enum|impl|trait|for|while|loop|if|else|match|return|break|continue|in|where|move|async|await|const|static|type|as|ref|unsafe|dyn|self|Self|super|crate)\b|\b(?:true|false)\b|\b(?:String|Vec|Option|Result|Some|None|Ok|Err|HashMap|Box|Arc|Mutex|Send|Sync|Copy|Clone|Debug|Display|Iterator|u8|u16|u32|u64|u128|usize|i8|i16|i32|i64|i128|isize|f32|f64|bool|char|str)\b|\b[a-zA-Z_]\w*!|\b\d+(?:\.\d+)?\b)/g;

export function CodeHighlight({ code, className = "" }: { code: string; className?: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of code.matchAll(RUST_TOKENS)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(code.slice(last, index));
    const token = match[0];
    let kind = "keyword";
    if (token.startsWith("//") || token.startsWith("/*")) kind = "comment";
    else if (token.startsWith('"') || token.startsWith("r\"") || token.startsWith("r#") || token.startsWith("'")) kind = "string";
    else if (/^\d/.test(token) || token === "true" || token === "false") kind = "number";
    else if (token.endsWith("!")) kind = "macro";
    else if (/^(String|Vec|Option|Result|Some|None|Ok|Err|HashMap|Box|Arc|Mutex|Send|Sync|Copy|Clone|Debug|Display|Iterator|[uif]\d+|usize|isize|bool|char|str)$/.test(token)) kind = "type";
    nodes.push(<span className={`rust-token-${kind}`} key={`${index}-${last}`}>{token}</span>);
    last = index + token.length;
  }
  if (last < code.length) nodes.push(code.slice(last));
  return <code className={`rust-highlight ${className}`}>{nodes}</code>;
}

export default CodeHighlight;
