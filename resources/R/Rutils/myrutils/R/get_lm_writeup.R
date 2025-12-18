#' Create a writeup for the results of a linear regression model (lms and lmers).
#'
#' This function takes the results of a linear regression model and
#' creates a writeup for the results.
#'
#' The format of the writeup is as follows:
#'      b = (Estimate/Slope), F(numDf, denDf) = (F), [t(numDf, denDf) = (t.ratio)], p = (p.value)
#'
#' @param model A linear regression model (lms and lmers).
#'
#' @param variable The variable to create the writeup for. If NA, the writeup
#' will be created for all variables.
#'
#' @importFrom methods is
#'
#' @param type The type of writeup to create. Can be "statement" or "table".
#'
#' @return A string data frame with the writeup(s).
#'
#' @export

get_lm_writeup <- function(model, variable = NA, type = "statement") {
    if (!(type %in% c("statement", "table"))) {
        stop("Invalid type argument. Must be 'statement' or 'table'.")
    }

    if (!is(model, "lmerModLmerTest") && !is(model, "lm")) {
        stop("Invalid model argument. Must be a linear regression model.")
    }

    if (is(model, "lmerModLmerTest")) {
        summary <- as.data.frame(
            summary(
                model,
                ddf = "Kenward-Roger"
            )$coef
        )[-1, ]
        anova <- anova(model, ddf = "Kenward-Roger")
    } else {
        summary <- as.data.frame(summary(model)$coef)[-1, ]
        anova <- anova(model)
    }


    results <- cbind.data.frame(
        Estimate = summary[, "Estimate"],
        n.df = ifelse(
            "NumDF" %in% colnames(anova),
            anova["NumDF"],
            ifelse(
                "Df" %in% colnames(anova),
                anova[-nrow(anova), "Df"],
                1
            )
        ),
        df = ifelse(
            "DenDF" %in% colnames(anova),
            anova["DenDF"],
            ifelse(
                "Df" %in% colnames(anova),
                anova[nrow(anova), "Df"],
                1
            )
        ),
        F.value = filter(
            as.data.frame(anova[, "F value"]),
            !is.na(as.data.frame(anova[, "F value"]))
        ),
        t.ratio = summary[, "t value"],
        p.value = summary[, "Pr(>|t|)"]
    )

    colnames(results) <- c(
        "Estimate",
        "n.df",
        "df",
        "F.value",
        "t.ratio",
        "p.value"
    )

    results$Estimate <- round(results$Estimate, 2)
    results$df <- round(results$df, 0)
    results$F.value <- round(results$F.value, 2)
    results$t.ratio <- round(results$t.ratio, 2)
    results$p.value <- round(results$p.value, 3)

    if (type == "table") {
        results <- cbind.data.frame(
            Variable = rownames(summary),
            results
        )
        rownames(results) <- NULL
        ifelse(
            is.na(variable),
            return(results),
            return(results[results$Variable == variable, ])
        )
    }

    statements <- paste0(
        "b = ", results$Estimate, ", ",
        "F(", results$n.df, ",", results$df, ") = ",
        results$F.value, ", ",
        "[t(", results$n.df, ",", results$df, ") = ",
        results$t.ratio, "], ",
        ifelse(
            results$p.value < 0.001,
            "p < 0.001",
            paste0("p = ", results$p.value)
        )
    )

    output <- data.frame(
        Variable = rownames(summary),
        Statement = statements
    )

    ifelse(
        is.na(variable),
        return(output),
        return(output[output$Variable == variable, ]$Statement)
    )
}
