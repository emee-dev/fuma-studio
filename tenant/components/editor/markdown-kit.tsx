"use client";

import {
  MarkdownPlugin,
  MdYaml,
  remarkMdx,
  remarkMention,
} from "@platejs/markdown";
import {
  createFscPlugin,
  fscMdxRules,
  type FSComponent,
  type FSCProps,
} from "@trythis/fuma-react/editor";
import { useFSCState } from "@trythis/fuma-react/hooks";
import yaml from "js-yaml";
import { KEYS } from "platejs";
import remarkEmoji from "remark-emoji";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { PluginView } from "./markdown-ui";

export interface MyComponentElement extends FSComponent {
  type: "fs_component";
}

// Role: Handles all state logic.
// Passes data via props to the Plugin Consumer view-only component
// Can be client rendered.
export const PluginStateHandler = ({
  attributes,
  element,
}: FSCProps<MyComponentElement>) => {
  const { fsProps, isSelected, setFsProps, removeElement } = useFSCState({
    element,
  });

  return (
    <div className="relative" {...attributes} contentEditable={false}>
      <PluginView {...fsProps} />
      {isSelected && (
        <div className="space-y-2 absolute z-30 right-0 bg-accent">
          {Object.entries(fsProps || {}).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <label className="text-sm text-gray-700 w-20">{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) =>
                  setFsProps({ ...fsProps, [key]: e.target.value })
                }
                className="border rounded px-2 py-1 text-sm flex-1"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Yaml handler
export const YamlStateHandler = ({
  attributes,
  element,
}: FSCProps<MyComponentElement>) => {
  const { fsProps, isSelected, setFsProps, removeElement } = useFSCState({
    element,
  });

  return (
    <div className="relative" {...attributes} contentEditable={false}>
      <PluginView {...fsProps} purpose="Frontmatter" />
      {isSelected && (
        <div className="space-y-2 absolute z-30 right-0 bg-accent">
          {Object.entries(fsProps || {}).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <label className="text-sm text-gray-700 w-20">{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) =>
                  setFsProps({ ...fsProps, [key]: e.target.value })
                }
                className="border rounded px-2 py-1 text-sm flex-1"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

PluginStateHandler.fscId = "fs_component";

const customPlugins = createFscPlugin({
  [PluginStateHandler.fscId]: PluginStateHandler,
  ["fs_component_yaml"]: YamlStateHandler,
});

const rules = fscMdxRules({
  ...customPlugins,
  ...{
    yaml: {
      deserialize(mdastNode: MdYaml) {
        const frontmatter = mdastNode.value;

        const fsProps = yaml.load(frontmatter);
        return {
          type: "fs_component_yaml",
          fsProps,
          children: [],
        };
      },
      serialize(slateNode: FSComponent): MdYaml {
        const yamlValue = yaml.dump(slateNode.fsProps);

        return {
          type: "yaml",
          value: yamlValue,
          data: undefined,
        };
      },
    },
    fs_component_yaml: {
      serialize(slateNode: FSComponent): MdYaml {
        const yamlValue = yaml.dump(slateNode.fsProps);

        return {
          type: "yaml",
          value: yamlValue,
          data: undefined,
        };
      },
    },
  },
});

export const MarkdownKit = [
  ...Object.values(customPlugins),
  MarkdownPlugin.configure({
    options: {
      disallowedNodes: [KEYS.suggestion],
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkMath,
        remarkGfm,
        remarkMdx,
        remarkMention,
        remarkEmoji as any,
      ],
      rules,
    },
  }),
];
