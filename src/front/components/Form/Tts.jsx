import TextField from '@material-ui/core/TextField';

export default function Tts() {
  const [value, setValue] = React.useState('Привет!');

  return (
    <TextField
      label="TTS"
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
