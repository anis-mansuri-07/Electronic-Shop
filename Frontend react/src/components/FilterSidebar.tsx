import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Slider,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import { MdExpandMore, MdFilterList, MdClose } from "react-icons/md";
import type { ProductSearchParams } from "../types/product";
import categoryService from "../services/categoryService";

interface FilterSidebarProps {
  filters: ProductSearchParams;
  onFilterChange: (filters: ProductSearchParams) => void;
  onClearFilters: () => void;
}

const FilterSidebar = ({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice || 0,
    filters.maxPrice || 200000,
  ]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data.map((cat) => cat.categoryName));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);
  const brands = [
    "Apple",
    "Samsung",
    "Dell",
    "HP",
    "Sony",
    "LG",
    "Lenovo",
    "Asus",
  ];
  const colors = ["Black", "White", "Silver", "Gold", "Blue", "Red", "Green"];
  const discounts = [
    { label: "10% or more", value: 10 },
    { label: "20% or more", value: 20 },
    { label: "30% or more", value: 30 },
    { label: "50% or more", value: 50 },
  ];

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? undefined : category,
      pageNumber: 0,
    });
  };

  const handleBrandChange = (brand: string) => {
    onFilterChange({
      ...filters,
      brand: filters.brand === brand ? undefined : brand,
      pageNumber: 0,
    });
  };

  const handleColorChange = (color: string) => {
    onFilterChange({
      ...filters,
      colors: filters.colors === color ? undefined : color,
      pageNumber: 0,
    });
  };

  const handleDiscountChange = (discount: number) => {
    onFilterChange({
      ...filters,
      minDiscount: filters.minDiscount === discount ? undefined : discount,
      pageNumber: 0,
    });
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handlePriceCommit = () => {
    onFilterChange({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      pageNumber: 0,
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.brand ||
    filters.colors ||
    filters.minDiscount ||
    filters.minPrice ||
    filters.maxPrice;

  const formatPrice = (value: number) => {
    return `₹${(value / 1000).toFixed(0)}k`;
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 320,
        bgcolor: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box className="p-6 border-b border-gray-200">
        <Box className="flex items-center justify-between mb-2">
          <Box className="flex items-center gap-2">
            <MdFilterList className="text-2xl text-purple-600" />
            <Typography variant="h6" className="font-bold text-gray-900">
              Filters
            </Typography>
          </Box>
          {hasActiveFilters && (
            <Button
              size="small"
              onClick={onClearFilters}
              startIcon={<MdClose />}
              sx={{
                textTransform: "none",
                color: "#dc2626",
                fontSize: "0.85rem",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#fef2f2",
                },
              }}
            >
              Clear
            </Button>
          )}
        </Box>
        {hasActiveFilters && (
          <Box className="flex flex-wrap gap-2 mt-3">
            {filters.category && (
              <Chip
                label={filters.category}
                size="small"
                onDelete={() => handleCategoryChange(filters.category!)}
                sx={{
                  backgroundColor: "#f3f4f6",
                  "& .MuiChip-deleteIcon": { color: "#6b7280" },
                }}
              />
            )}
            {filters.brand && (
              <Chip
                label={filters.brand}
                size="small"
                onDelete={() => handleBrandChange(filters.brand!)}
                sx={{
                  backgroundColor: "#f3f4f6",
                  "& .MuiChip-deleteIcon": { color: "#6b7280" },
                }}
              />
            )}
            {filters.colors && (
              <Chip
                label={filters.colors}
                size="small"
                onDelete={() => handleColorChange(filters.colors!)}
                sx={{
                  backgroundColor: "#f3f4f6",
                  "& .MuiChip-deleteIcon": { color: "#6b7280" },
                }}
              />
            )}
          </Box>
        )}
      </Box>

      <Box
        className="overflow-y-auto"
        sx={{ maxHeight: "calc(100vh - 250px)" }}
      >
        {/* Category Filter */}
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary expandIcon={<MdExpandMore className="text-xl" />}>
            <Typography className="font-semibold text-gray-900">
              Category
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={filters.category || ""}>
                {categories.map((category) => (
                  <FormControlLabel
                    key={category}
                    value={category}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#9ca3af",
                          "&.Mui-checked": {
                            color: "#8b5cf6",
                          },
                        }}
                      />
                    }
                    label={category}
                    onChange={() => handleCategoryChange(category)}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.95rem",
                        color:
                          filters.category === category ? "#8b5cf6" : "#4b5563",
                        fontWeight: filters.category === category ? 600 : 400,
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Brand Filter */}
        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<MdExpandMore className="text-xl" />}>
            <Typography className="font-semibold text-gray-900">
              Brand
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {brands.map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.brand === brand}
                      onChange={() => handleBrandChange(brand)}
                      sx={{
                        color: "#9ca3af",
                        "&.Mui-checked": {
                          color: "#8b5cf6",
                        },
                      }}
                    />
                  }
                  label={brand}
                  sx={{
                    width: "100%",
                    ml: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.95rem",
                      color: filters.brand === brand ? "#8b5cf6" : "#4b5563",
                      fontWeight: filters.brand === brand ? 600 : 400,
                    },
                  }}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Color Filter */}
        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<MdExpandMore className="text-xl" />}>
            <Typography className="font-semibold text-gray-900">
              Color
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <Box
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className="cursor-pointer transition-all"
                  sx={{
                    position: "relative",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: color.toLowerCase(),
                    border:
                      filters.colors === color
                        ? "3px solid #8b5cf6"
                        : "2px solid #e5e7eb",
                    boxShadow:
                      filters.colors === color
                        ? "0 0 0 4px rgba(139, 92, 246, 0.1)"
                        : "none",
                    "&:hover": {
                      transform: "scale(1.1)",
                      borderColor: "#8b5cf6",
                    },
                  }}
                  title={color}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Price Range Filter */}
        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<MdExpandMore className="text-xl" />}>
            <Typography className="font-semibold text-gray-900">
              Price Range
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="px-2">
              <Box className="flex justify-between mb-4">
                <Typography
                  variant="body2"
                  className="font-semibold text-purple-600"
                >
                  {formatPrice(priceRange[0])}
                </Typography>
                <Typography
                  variant="body2"
                  className="font-semibold text-purple-600"
                >
                  {formatPrice(priceRange[1])}
                </Typography>
              </Box>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                onChangeCommitted={handlePriceCommit}
                valueLabelDisplay="auto"
                valueLabelFormat={formatPrice}
                min={0}
                max={200000}
                step={5000}
                sx={{
                  color: "#8b5cf6",
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0 0 0 8px rgba(139, 92, 246, 0.16)",
                    },
                  },
                  "& .MuiSlider-valueLabel": {
                    backgroundColor: "#8b5cf6",
                  },
                }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Discount Filter */}
        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<MdExpandMore className="text-xl" />}>
            <Typography className="font-semibold text-gray-900">
              Discount
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={filters.minDiscount || ""}>
                {discounts.map((discount) => (
                  <FormControlLabel
                    key={discount.value}
                    value={discount.value}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#9ca3af",
                          "&.Mui-checked": {
                            color: "#8b5cf6",
                          },
                        }}
                      />
                    }
                    label={discount.label}
                    onChange={() => handleDiscountChange(discount.value)}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.95rem",
                        color:
                          filters.minDiscount === discount.value
                            ? "#8b5cf6"
                            : "#4b5563",
                        fontWeight:
                          filters.minDiscount === discount.value ? 600 : 400,
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default FilterSidebar;
