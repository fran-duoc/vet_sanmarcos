function Seccion({id, titulo, children}){
    return(
       <>
          <section id={id} className="seccion">
            <h2>{titulo}</h2>
            {children}
        </section>

       </>
    );
}

export default Seccion