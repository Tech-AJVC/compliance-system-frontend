import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ListFilter, X } from "lucide-react";
import { motion } from "motion/react";
import { nanoid } from "nanoid";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// AnimateChangeInHeight component for smooth transitions
const AnimateChangeInHeight = ({ children, className }) => {
  const containerRef = useRef(null);
  const [height, setHeight] = useState("auto");

  React.useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const observedHeight = entries[0].contentRect.height;
        setHeight(observedHeight);
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <motion.div
      className={cn(className, "overflow-hidden")}
      style={{ height }}
      animate={{ height }}
      transition={{ duration: 0.1, damping: 0.2, ease: "easeIn" }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
};

const FilterComponent = ({
  filterOptions,
  setFilters: setFiltersProps,
  setSearchOptions,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [commandInput, setCommandInput] = useState("");
  const commandInputRef = useRef(null);
  const [filters, setFilters] = useState([]);
  const [selectedRelation, setSelectedRelation] = useState({});
  const [dateRange, setDateRange] = useState(null); // State to store selected date range

  // Handle filter selection
  const handleFilterSelect = useCallback(
    (filterId) => {
      const filter = filterOptions.find((opt) => opt.id === filterId);
      if (filter) {
        setSelectedFilter(filter);

        // Open popover if the filter type is date_range
        if (filter.type === "date_range") {
          setOpen(true); // Ensure popover opens
        } else {
          // Set default relation and focus input for other filter types
          if (filter.relation && filter.relation.length > 0) {
            setSelectedRelation((prev) => ({
              ...prev,
              [filterId]: filter.relation[0],
            }));
          }
          setCommandInput("");
          commandInputRef.current?.focus();
        }
      }
    },
    [filterOptions],
  );

  useEffect(() => {
    if (setSearchOptions && selectedFilter) {
      setSearchOptions({
        filterId: selectedFilter.id,
        search: commandInput,
      });
    }
  }, [setSearchOptions, selectedFilter, commandInput]);

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (selectedFilter) {
      const existingFilter = filters.find(
        (filter) =>
          filter.filterId === selectedFilter.id &&
          filter.optionId === option.id,
      );

      if (!existingFilter) {
        const newFilter = {
          id: nanoid(),
          filterId: selectedFilter.id,
          filterName: selectedFilter.name,
          filterIcon: selectedFilter.icon,
          relation:
            selectedRelation[selectedFilter.id] || selectedFilter.relation[0],
          optionId: option.id,
          optionLabel: option.label,
          optionIcon: option.icon,
        };

        const filterProps = {
          filterid: selectedFilter.id,
          optionid: option.id,
        };
        setFiltersProps((prev) => [...prev, filterProps]);
        setFilters((prev) => [...prev, newFilter]);
      }

      setSelectedFilter(null);
      setCommandInput("");
      setOpen(false);
    }
  };

  // Handle date range selection
  const handleDateRangeSelect = (range) => {
    if (range?.from && range?.to) {
      const newFilter = {
        id: nanoid(),
        filterId: selectedFilter.id,
        filterName: selectedFilter.name,
        filterIcon: selectedFilter.icon,
        relation: null,
        optionId: null,
        optionLabel: `From: ${range.from.toLocaleDateString()} To: ${range.to.toLocaleDateString()}`,
        optionIcon: null,
      };

      setFiltersProps((prev) => [
        ...prev,
        { filterid: "start_date", optionid: range.from.toLocaleDateString("en-CA") },
        { filterid: "end_date", optionid: range.to.toLocaleDateString("en-CA") },
      ]); // Add separate objects for start_date and end_date

      setFilters((prev) => [...prev, newFilter]);

      setOpen(false); // Close the popover
      setSelectedFilter(null); // Reset selected filter
      setDateRange(null); // Clear calendar selection
    }
  };

  // Handle relation change
  const handleRelationChange = (filterId, relation) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId ? { ...filter, relation } : filter,
      ),
    );
  };

  // Remove filter
  const removeFilter = (filterId) => {
    console.log("Remove filter", filterId, filters);
    setFilters((prev) => prev.filter((filter) => filter.id !== filterId));
    const filterToRemove = filters.find((filter) => filter.id === filterId);
    if (filterToRemove) {
      setFiltersProps((prev) =>
        prev.filter(
          (filter) =>
            !(
              filter.filterid === filterToRemove.filterId &&
              filter.optionid === filterToRemove.optionId
            ),
        ),
      );
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters([]);
    setFiltersProps([]);
  };

  const generateFilterFields = useCallback(
    (filter) => {
      switch (filter.type) {
        case "component":
          return (
            <CommandItem
              key={filter.id}
              value={filter.id}
              onSelect={() => handleFilterSelect(filter.id)}
            >
              {React.cloneElement(filter.icon, {
                className: "size-3.5 me-2",
              })}
              {filter.name}
            </CommandItem>
          );
        case "divider":
          return <CommandSeparator key={filter.id} />;
        case "date_range":
          return (
            <CommandItem
              key={filter.id}
              value={filter.id}
              onSelect={() => handleFilterSelect(filter.id)}
            >
              {React.cloneElement(filter.icon, {
                className: "size-3.5 me-2",
              })}
              {filter.name}
            </CommandItem>
          );
        default:
          return null;
      }
    },
    [handleFilterSelect],
  );

  return (
    <div className="flex justify-end gap-2">
      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div key={filter.id} className="flex items-center gap-[1px] text-xs">
            <div className="bg-muted flex shrink-0 items-center gap-1.5 rounded-l px-1.5 py-1">
              {React.cloneElement(filter.filterIcon, { className: "size-3.5" })}
              {filter.filterName}
            </div>

            {/* Relation Dropdown */}
            {filterOptions.find((opt) => opt.id === filter.filterId)?.relation
              .length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-muted hover:bg-muted/50 text-muted-foreground hover:text-primary shrink-0 px-1.5 py-1 transition">
                  {filter.relation}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-fit min-w-fit">
                  {filterOptions
                    .find((opt) => opt.id === filter.filterId)
                    ?.relation.map((rel) => (
                      <DropdownMenuItem
                        key={rel}
                        onClick={() => handleRelationChange(filter.id, rel)}
                      >
                        {rel}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="bg-muted text-muted-foreground flex shrink-0 items-center gap-1.5 rounded-none px-1.5 py-1">
              {filter.optionIcon &&
                React.cloneElement(filter.optionIcon, {
                  className: "size-3.5",
                })}
              {filter.optionLabel}
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFilter(filter.id)}
              className="bg-muted text-muted-foreground hover:text-primary hover:bg-muted/50 h-6 w-6 shrink-0 rounded-l-none rounded-r-sm transition"
            >
              <X className="size-3" />
            </Button>
          </div>
        ))}
      </div>

      {filters.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="group h-6 items-center rounded-sm text-xs transition"
          onClick={clearAllFilters}
        >
          Clear
        </Button>
      )}

      {/* Filter Popover */}
      <Popover
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            setTimeout(() => {
              setSelectedFilter(null);
              setCommandInput("");
              setDateRange(null); // Clear calendar selection when popover is closed
            }, 200);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            size="sm"
            className={cn(
              "group flex h-6 items-center gap-1.5 rounded-sm text-xs transition",
              filters.length > 0 && "w-8",
            )}
          >
            <ListFilter className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-all" />
            {!filters.length && "Filter"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="me-2 w-[250px] p-0">
          <AnimateChangeInHeight>
            <Command>
              {/* Render CommandInput and CommandList only for non-date_range filters */}
              {selectedFilter?.type !== "date_range" && (
                <>
                  <CommandInput
                    placeholder={
                      selectedFilter ? selectedFilter.name : "Filter..."
                    }
                    className="h-9"
                    value={commandInput}
                    onInputCapture={(e) => {
                      setCommandInput(e.currentTarget.value);
                    }}
                    ref={commandInputRef}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    {selectedFilter &&
                      selectedFilter.options.map((option) => (
                        <CommandItem
                          key={option.id}
                          value={option.id}
                          onSelect={() => handleOptionSelect(option)}
                        >
                          {option.icon &&
                            React.cloneElement(option.icon, {
                              className: "size-3.5 me-2",
                            })}
                          {option.label}
                        </CommandItem>
                      ))}

                    {!selectedFilter && filterOptions.map(generateFilterFields)}
                  </CommandList>
                </>
              )}

              {/* Render Calendar directly for date_range filters */}
              {selectedFilter?.type === "date_range" && (
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    handleDateRangeSelect(range);
                  }}
                  initialFocus
                />
              )}
            </Command>
          </AnimateChangeInHeight>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterComponent;
