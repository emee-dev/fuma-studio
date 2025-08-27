import {
  MarkdownPlugin,
  MdMdxJsxTextElement,
  remarkMdx,
  remarkMention,
} from "@platejs/markdown";
import { KEYS } from "platejs";
import {
  createPlatePlugin,
  PlateElementProps,
  useEditorRef,
  useSelected,
} from "platejs/react";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

type MyComponentElement = {
  type: "fs_component";
  props?: Record<string, any>; // store arbitrary props here
  children: [{ text: "" }];
};

export const MyOwnElement = ({
  attributes,
  element,
}: PlateElementProps<MyComponentElement>) => {
  const editor = useEditorRef();
  const selected = useSelected();

  // Make the props property to be a json string to
  // help reduce advanced parsing logic for props.
  const { props } = element;

  const handlePropChange = (key: string, value: string) => {
    if (!editor.selection) return;

    editor.tf.setNodes<MyComponentElement>(
      { props: { ...props, [key]: value } },
      {
        at: {
          anchor: editor.selection.anchor,
          focus: editor.selection.focus,
        },
        match: (n) => n === element,
      }
    );
  };

  return (
    <div
      {...attributes}
      className="bg-blue-100 border border-blue-400 rounded p-2 my-2"
      contentEditable={false}
    >
      <span className="font-bold text-blue-700 block mb-2">
        🚀 MyOwnComponent
      </span>

      {/* Show prop editor only when the node is selected */}
      {selected ? (
        <div className="space-y-2">
          {Object.entries(props || {}).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <label className="text-sm text-gray-700 w-20">{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => handlePropChange(key, e.target.value)}
                className="border rounded px-2 py-1 text-sm flex-1"
              />
            </div>
          ))}
        </div>
      ) : (
        <pre className="text-xs text-gray-600">
          {JSON.stringify(props, null, 2)}
        </pre>
      )}
    </div>
  );
};

const KEY_MYCOMPONENT = "fs_component";

export const MyComponentPlugin = createPlatePlugin({
  key: KEY_MYCOMPONENT,
  node: {
    isElement: true,
    isVoid: true,
  },
});

export const MarkdownKit = [
  MyComponentPlugin.withComponent(MyOwnElement),
  MarkdownPlugin.configure({
    options: {
      disallowedNodes: [KEYS.suggestion],
      // Add remark plugins for syntax extensions (GFM, Math, MDX)
      remarkPlugins: [
        remarkMath,
        remarkGfm,
        remarkMdx,
        remarkMention,
        remarkEmoji as any,
      ],
      rules: {
        fs_component: {
          deserialize(mdastNode: MdMdxJsxTextElement) {
            const props: Record<string, any> = {};

            for (const attr of mdastNode.attributes || []) {
              if (attr.type === "mdxJsxAttribute") {
                props[attr.name] = attr.value ?? true; // boolean if no value
              }
            }

            return {
              type: KEY_MYCOMPONENT,
              props,
              children: [{ text: "" }],
            };
          },
          serialize(slateNode: MyComponentElement): MdMdxJsxTextElement {
            return {
              type: "mdxJsxTextElement",
              name: KEY_MYCOMPONENT,
              // At the moment only simple literal types are supported.
              // Another workaround would be to stringify the structure for the user to consume.
              attributes: Object.entries(slateNode.props || {}).map(
                ([key, value]) => ({
                  type: "mdxJsxAttribute",
                  name: key,
                  value:
                    typeof value === "string" ? value : JSON.stringify(value),
                })
              ),
              children: [], // self-closing
            };
          },
        },
      },
    },
  }),
];
