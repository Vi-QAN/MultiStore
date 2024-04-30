
import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

const useSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [chosenCategories, setChosenCategories] = useState([]);
    const [chosenSort, setChosenSort] = useState('');
    const [ priceRange, setPriceRange ] = useState(0); 
    const [ products, setProducts ] = useState([]);
    const [ totalPage, setTotalPage ] = useState(0);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ pageSize, setPageSize ] = useState(12);

    const handleSearchTermChange = (value) => {
        if (value.length === 0) {
            setSearchTerm('');
        } else {
            setSearchTerm(value);
        }
    };

    const handleSortChange = (newSort) => {
        setChosenSort(newSort);
    }

    const handleCategoryChange = (category) => {
        const value = chosenCategories.find(item => item === category.id)
        if (value) {
            setChosenCategories(chosenCategories.filter(cat => cat !== category.id));
        } else {
            setChosenCategories([...chosenCategories, category.id]);
        }
    };

    const handlePriceRangeChange = (newValue) => {
        setPriceRange(newValue);
    }


    return {
        searchTerm,
        chosenCategories,
        priceRange,
        chosenSort,
        products,
        totalPage,
        currentPage,
        pageSize,
        handleSearchTermChange,
        handleCategoryChange,
        handlePriceRangeChange,
        handleSortChange,
        setProducts,
        setChosenCategories,
        setTotalPage,
        setCurrentPage,
        setPageSize
    };
};

export const SearchProvider = ({ children }) => {
    const search = useSearch();
  
    return (
      <SearchContext.Provider value={search}>
        {children}
      </SearchContext.Provider>
    );
};

export const SearchConsumer = () => {
    return useContext(SearchContext);
};


