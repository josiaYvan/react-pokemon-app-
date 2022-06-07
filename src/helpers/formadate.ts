// formatage de date//hook personnaliser
const formatDate = (date: Date = new Date()): string => {
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
}
 export default formatDate;

// passer en params un donnee de type sinon si y pas donc passant un new date 
// celui ci est pour le db.json sans createDate.