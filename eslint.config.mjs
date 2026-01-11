import nextConfig from "eslint-config-next";

export default [
	{
		ignores: ["**/playground.mongodb.js"],
	},
	...nextConfig,
	{
		rules: {
			"react-hooks/set-state-in-effect": "off",
			"react-hooks/immutability": "off",
			"import/no-anonymous-default-export": "off",
		},
	},
];
