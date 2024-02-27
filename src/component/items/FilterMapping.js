// key = color | name;
export const filterMapping = (data, key) => {
    if (!data) return;
    return data.reduce(
        (accumulator, currentValue) => {
            const obj = {
                name: currentValue.attributes[key],
                id: currentValue.id
            }
            return [...accumulator, obj]
        },
        [],
    )
}

