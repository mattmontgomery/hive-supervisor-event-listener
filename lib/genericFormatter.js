module.exports = function genericFormatter(event, headers, data) {
    return `:gear: supervisord event :gear: \`${event}\`

*Headers*:
\`\`\`
${JSON.stringify(headers)}
\`\`\`

*Data*:
\`\`\`
${JSON.stringify(data)}
\`\`\`
`;
}
