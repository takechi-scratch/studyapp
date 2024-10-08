import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function AppChangeId({icon, ...other }) {
    const [datasetID, setDatasetID] = useState("");
    const navigate = useNavigate()
    const handleClick = () => {
        console.log(datasetID);
        navigate("/questions");
    }

  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}

      <Stack spacing={1.5}>
        <Typography variant="h4">問題を読み込む</Typography>
        <Stack direction="row" spacing={2}>
            <TextField
                id="outlined-basic" label="データベースID" variant="outlined"
                onChange={e => {
                    setDatasetID(e.target.value)
                }}
            />
            <Button variant="outlined" onClick={handleClick}>読み込み</Button>
        </Stack>
      </Stack>
    </Card>
  );
}

AppChangeId.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
