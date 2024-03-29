function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  let x;
  if (/\s/.test(name)) {
    x = name.split(" ")[0][0].concat(name.split(" ")[1][0]);
  } else {
    x = name[0];
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 150,
      height: 150,
      fontSize: 50,
      margin: "auto",
      marginBottom: 10,
    },
    children: `${x}`,
  };
}

export default stringAvatar;
