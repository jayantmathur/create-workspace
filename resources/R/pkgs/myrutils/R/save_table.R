#' Save a table to a file
#'
#' This function saves a table (data frame) to a file using knitr's kable function.
#' The table is saved in markdown format.
#' The alignment of the columns can be specified with the align parameter.
#' If no alignment is specified, the first column is left-aligned and the rest are right-aligned.
#'
#' @param table A data frame to be saved.
#' @param filename The name of the file where the table will be saved.
#' @param align A character vector specifying the alignment of the columns.
#'
#' @importFrom knitr kable
#'
#' @return No return value, called for side effects
#' @examples
#' \dontrun{
#' save_table(mtcars, "mtcars.md")
#' }
#' @export
save_table <- function(table, filename, align = NULL) {
    # Check if table and filename are provided
    if (missing(table)) {
        stop("The 'table' argument must be provided.")
    }
    if (missing(filename)) {
        stop("The 'filename' argument must be provided.")
    }

    output <- capture.output(
        knitr::kable(
            table,
            "markdown",
            align = ifelse(
                is.null(align),
                paste0(
                    collapse = "",
                    c("l", rep("r", times = ncol(table) - 1))
                ),
                align
            )
        )
    )

    # Extract the directory name from the filename
    dir_name <- dirname(filename)

    # Create the directory if it does not exist
    if (!dir.exists(dir_name)) {
        dir.create(dir_name, recursive = TRUE)
    }

    writeLines(output, filename)
}
