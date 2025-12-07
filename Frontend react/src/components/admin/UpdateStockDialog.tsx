import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";
import productAdminService from "../../services/productAdminService";

interface UpdateStockDialogProps {
  open: boolean;
  onClose: () => void;
  productId: number;
  productTitle: string;
  currentStock: number;
  onSuccess: () => void;
}

const UpdateStockDialog: React.FC<UpdateStockDialogProps> = ({
  open,
  onClose,
  productId,
  productTitle,
  currentStock,
  onSuccess,
}) => {
  const [newStock, setNewStock] = useState<string>(String(currentStock));
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    setError("");

    const stock = Number(newStock);
    if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      setError(
        "Please enter a valid quantity (must be a whole number 0 or greater)"
      );
      return;
    }

    try {
      setUpdating(true);
      await productAdminService.updateStock(productId, stock);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update stock");
    } finally {
      setUpdating(false);
    }
  };

  const handleClose = () => {
    if (!updating) {
      setError("");
      setNewStock(String(currentStock));
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Stock - {productTitle}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            label="New Stock Quantity"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            fullWidth
            autoFocus
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            helperText={`Current stock: ${currentStock}`}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={updating}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={updating}>
          {updating ? "Updating..." : "Update Stock"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStockDialog;
