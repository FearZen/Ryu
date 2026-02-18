'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCraftingItem(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const base_price = parseFloat(formData.get('base_price') as string) || 0
    const image_url = formData.get('image_url') as string
    const ingredientsJson = formData.get('ingredients') as string

    if (!name || !category) {
        return { error: 'Name and Category are required' }
    }

    // 1. Create Crafting Item (Blueprint)
    const { data: newItem, error } = await supabase
        .from('crafting_items')
        .insert({
            name,
            category,
            description,
            base_price,
            image_url,
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    // 2. Insert Ingredients if any
    if (ingredientsJson && newItem) {
        try {
            const ingredients = JSON.parse(ingredientsJson) as { material_id: string; quantity: number }[]

            if (ingredients.length > 0) {
                const ingredientRows = ingredients.map(ing => ({
                    recipe_id: newItem.id,
                    material_id: ing.material_id,
                    quantity: ing.quantity
                }))

                const { error: ingError } = await supabase
                    .from('recipe_ingredients')
                    .insert(ingredientRows)

                if (ingError) {
                    console.error('Error inserting ingredients:', ingError)
                    // Optional: revert item creation or return warning
                }
            }
        } catch (e) {
            console.error('Error parsing ingredients:', e)
        }
    }

    revalidatePath('/crafting')
    revalidatePath('/admin/crafting')
    redirect('/admin/crafting')
}

export async function deleteCraftingItem(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('crafting_items')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/crafting')
    revalidatePath('/admin/crafting')
    redirect('/admin/crafting')
}

export async function updateCraftingItem(id: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const base_price = parseFloat(formData.get('base_price') as string) || 0
    const image_url = formData.get('image_url') as string
    const ingredientsJson = formData.get('ingredients') as string

    if (!name || !category) {
        return { error: 'Name and Category are required' }
    }

    // 1. Update Crafting Item
    const { error } = await supabase
        .from('crafting_items')
        .update({
            name,
            category,
            description,
            base_price,
            image_url,
        })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    // 2. Update Ingredients (Delete all and re-insert)
    if (ingredientsJson) {
        try {
            const ingredients = JSON.parse(ingredientsJson) as { material_id: string; quantity: number }[]

            // Delete existing
            const { error: delError } = await supabase
                .from('recipe_ingredients')
                .delete()
                .eq('recipe_id', id)

            if (delError) console.error('Error deleting ingredients:', delError)

            // Insert new
            if (ingredients.length > 0) {
                const ingredientRows = ingredients.map(ing => ({
                    recipe_id: id,
                    material_id: ing.material_id,
                    quantity: ing.quantity
                }))

                const { error: ingError } = await supabase
                    .from('recipe_ingredients')
                    .insert(ingredientRows)

                if (ingError) console.error('Error inserting ingredients:', ingError)
            }
        } catch (e) {
            console.error('Error parsing ingredients:', e)
        }
    }

    revalidatePath('/crafting')
    revalidatePath('/admin/crafting')
    redirect('/admin/crafting')
}


