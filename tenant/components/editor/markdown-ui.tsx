// Role: Render data in a stateless manner.
// Accepts data via props should be the view layer
// of our little MVC setup.
// Can be server rendered.
export const PluginView = (fsProps: Record<string, any>) => {
  return (
    <div className="bg-blue-100 border border-blue-400 rounded p-2 my-2">
      <span className="font-bold text-blue-700  mb-2 flex ">
        {fsProps.purpose || "🚀 MyOwnComponent"}
      </span>

      {/* Show prop editor only when the node is selected */}
      <pre className="text-xs text-gray-600">
        {JSON.stringify(fsProps, null, 2)}
      </pre>
    </div>
  );
};
