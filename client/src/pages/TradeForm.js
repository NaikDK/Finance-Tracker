import { Grid, MenuItem, Box, Paper, Typography, TextField, Button } from "@mui/material"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { useEffect, useState } from "react"

export default function TradeForm(){
    useEffect(() => {
        document.title = "Trade Entry Form";
    }, []);
    const [trade, setTrade] = useState({
        ticker: "",
        quantity: "1",
        strike: "",
        type: "",
        buyPrice: "",
        sellPrice: "",
        buyDate: "",
        sellDate: ""
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setTrade((prev) => ({...prev, [name]:value}));
        // console.log(trade);
    };
    
    const handleDateChange = (name, val) => {
        console.log(name, val);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: "auto", mt: 4}}>
            <Typography variant="h4" gutterBottom align="center">Add New Trade</Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2} margin={2}>
                    <Grid item xs={12}>
                        <TextField 
                            required 
                            label="Ticker" 
                            name="ticker"
                            value={trade.ticker}
                            onChange={handleChange}
                            placeholder="SPY"
                            />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            Ticker Name
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2} margin={2}>
                    <Grid item xs={12}>
                        <TextField
                            select
                            required
                            label="Type"
                            name="type"
                            value={trade.type}
                            onChange={handleChange}
                            placeholder="Call"
                                >
                            <MenuItem value="call">Call</MenuItem>
                            <MenuItem value="put">Put</MenuItem>
                            </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            label="Strike"
                            name="strike"
                            value={trade.strike}
                            onChange={handleChange}
                            placeholder="670"
                                />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            label="Quantity"
                            name="quantity"
                            value={trade.quantity}
                            onChange={handleChange}
                            />
                    </Grid>
                    <Box elevation={3}>
                        <Grid container spacing={2} margin={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Action"
                                    name="action"
                                    value="Buy"
                                    onChange={handleChange}
                                    disabled
                                        />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Buy Price"
                                    name="buyPrice"
                                    value={trade.buyPrice}
                                    onChange={handleChange}
                                    />
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker 
                                        label="Buy Date"
                                        name="buyDate"
                                        onChange={handleDateChange}
                                        ></DatePicker>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} margin={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Action"
                                    name="action"
                                    value="Sell"
                                    onChange={handleChange}
                                    disabled
                                    >
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Sell Price"
                                    name="sellPrice"
                                    value={trade.sellPrice}
                                    onChange={handleChange}
                                    />
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker 
                                        label="Sell Date"
                                        name="sellDate"
                                        onChange={handleDateChange}
                                        ></DatePicker>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid>
                    <Button variant="contained">Submit</Button>
                </Grid>
            </Box>
        </Paper>
    )
}