function _stringLiteralTrimmer(lastNonEmptyLine, lineCount, line, i) {
  var isFirstLine = i === 0;
  var isLastLine = i === lineCount - 1;
  var isLastNonEmptyLine = i === lastNonEmptyLine;
  // replace rendered whitespace tabs with spaces
  var trimmedLine = line.replace(/\t/g, " ");
  // trim leading whitespace
  if (!isFirstLine) {
    trimmedLine = trimmedLine.replace(/^[ ]+/, "");
  }
  // trim trailing whitespace
  if (!isLastLine) {
    trimmedLine = trimmedLine.replace(/[ ]+$/, "");
  }
  if (trimmedLine.length > 0) {
    if (!isLastNonEmptyLine) {
      trimmedLine += " ";
    }
    return trimmedLine;
  }
  return "";
}

export default function handleWhiteSpace(value) {
  var lines = value.split(/\r\n|\n|\r/);
  var lastNonEmptyLine = 0;

  for (var i = lines.length - 1; i > 0; i--) {
    if (lines[i].match(/[^ \t]/)) {
      lastNonEmptyLine = i;
      break;
    }
  }
  var str = lines
    .map(_stringLiteralTrimmer.bind(null, lastNonEmptyLine, lines.length))
    .filter(function(line) {
      return line.length > 0;
    })
    .join("");

  if (str.length > 0) {
    return str;
  }
  return "";
}
