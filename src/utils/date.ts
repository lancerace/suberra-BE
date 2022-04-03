export async function readableFormat(date: Date){

    return date.toLocaleDateString(
        'en-gb',
        {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'GMT'
        }
    );
}