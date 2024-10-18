import React, { useState, useEffect } from 'react';
import { useAuth } from "../../auth"
import "./index.css"

const CategoriesList = ({ categories, getCategories }) => {
    const { backendActor } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (categories !== undefined) {
            setIsLoading(false);
        }
    }, [categories]);

    const deleteCategory = async (categoryId) => {
        if (backendActor && categories) {
            let response = await backendActor.deleteCategory(Number(categoryId));
            console.log("delete Category", response);
            getCategories();
        }
    };
    /*
        if (isLoading) {
            return <div>Loading...</div>;
        }
    */
    return (
        <div className="CategoriesList">
            <h2>Categories</h2>
            {categories && categories.length > 0 ? (categories.map((category) => (
                <div key={Number(category.id)}>
                    {category.name}<button onClick={() => deleteCategory(category.id)}>Delete Category</button>
                </div>
            ))
            ) : (<p>No categories found.</p>)
            }
        </div>
    );
};

export default CategoriesList;
