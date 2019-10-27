import TextField from '@material-ui/core/TextField';

export default function Text() {
  const [value, setValue] = React.useState('Привет!');
  //const [value, setValue] = React.useState(state => state.fixedResponse.text);

  //
  React.useEffect(() => {
    console.log('text use effect called');
    // onFixedTextChanged.addlistener(() => {
    //   //const value = getState().fixedResponse.text;
    //   /setValue(value);
    // })
  });

  return (
    <TextField
      label="TEXT"
      multiline
      rows="3"
      value={value}
      onChange={e => setValue(e.target.value)}
      margin="normal"
      variant="outlined"
      fullWidth
    />
  );
}
