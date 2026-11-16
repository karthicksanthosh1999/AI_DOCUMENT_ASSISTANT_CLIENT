
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { highlightText } from "../utils/highlightText";
import React from "react";

interface Props {
  content: string;
}

const HighlightedMarkdown = ({ content }: Props) => {
  return (
    <div className="prose prose-sm max-w-none prose-headings:text-slate-900 prose-strong:text-slate-900 prose-li:my-1 prose-p:leading-7">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p>{renderChildren(children)}</p>
          ),
          li: ({ children }) => (
            <li>{renderChildren(children)}</li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const renderChildren = (children: React.ReactNode): React.ReactNode => {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return highlightText(child);
    }

    if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
      return React.cloneElement(child, {
        children: renderChildren(child.props.children),
      });
    }

    return child;
  });
};

export default HighlightedMarkdown;
