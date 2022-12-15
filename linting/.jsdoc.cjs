module.exports = {
    "plugins": [
        "jsdoc",
        "eslint-plugin-tsdoc",
    ],
    "rules": {
        "jsdoc/check-access": "error",
        "jsdoc/check-alignment": "error",
        "jsdoc/check-indentation": "off",
        "jsdoc/check-line-alignment": ["error", "always", {"preserveMainDescriptionPostDelimiter": true}],
        "jsdoc/check-param-names": "error",
        "jsdoc/check-property-names": "error",
        "jsdoc/check-tag-names": ["error", {
            "jsxTags": true,
        }],
        "jsdoc/check-values": "error",
        "jsdoc/empty-tags": "error",
        "jsdoc/multiline-blocks": "error",
        "jsdoc/newline-after-description": "error",
        "jsdoc/no-bad-blocks": "error",
        "jsdoc/no-multi-asterisks": "error",
        "jsdoc/no-types": "error",
        "jsdoc/require-asterisk-prefix": "error",
        "jsdoc/require-description": "error",
        "jsdoc/require-description-complete-sentence": ["warn", {
            "abbreviations": ["ex", "ie", "i.e."],
        }],
        // TODO: If all the code has jsdoc comments, consider turning this on
        "jsdoc/require-jsdoc": "off",
        "jsdoc/require-param-description": "error",
        "jsdoc/require-param-name": "error",
        "jsdoc/require-param": "error",
        "jsdoc/require-property": "error",
        "jsdoc/require-property-description": "error",
        "jsdoc/require-property-name": "error",
        "jsdoc/require-returns-check": "error",
        "jsdoc/require-returns-description": "error",
        "jsdoc/require-returns": "error",
        "jsdoc/require-throws": "error",
        "jsdoc/require-yields": "error",
        "jsdoc/require-yields-check": "error",
        "jsdoc/tag-lines": ["error", "never"],
        "jsdoc/valid-types": "error",

        "tsdoc/syntax": "error",
    },
}
