/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import React, { ReactElement, useMemo } from 'react';

import { ChonkyIconName } from '../../types/icons.types';
import { ChonkyActions } from '../../util/file-actions-definitions';
import { c, important, makeChonkyStyles } from '../../util/styles';
import { useFolderChainItems } from './FileNavbar-hooks';
import { NewSmartToolbarButton, NewToolbarButton } from './NewToolbarButton';

export interface FileNavbarProps {}

export const FileNavbar: React.FC<FileNavbarProps> = (props) => {
    const classes = useStyles();
    const folderChainItems = useFolderChainItems();

    const folderChainComponents = useMemo(() => {
        const components: ReactElement[] = [];
        for (let i = 0; i < folderChainItems.length; ++i) {
            const { file, disabled, onClick } = folderChainItems[i];
            const key = `folder-chain-${file ? file.id : i}`;
            const className = c({
                [classes.baseBreadcrumb]: true,
                [classes.disabledBreadcrumb]: disabled,
                [classes.currentBreadcrumb]: i === folderChainItems.length - 1,
            });
            const text = file ? file.name : 'Loading...';
            const component = (
                <NewToolbarButton
                    icon={i === 0 ? ChonkyIconName.folder : null}
                    className={className}
                    key={key}
                    text={text}
                    disabled={disabled}
                    onClick={onClick}
                />
            );
            components.push(component);
        }
        return components;
    }, [folderChainItems, classes]);

    return (
        <Box className={classes.navbarWrapper}>
            <Box className={classes.navbarContainer}>
                <NewSmartToolbarButton
                    fileActionId={ChonkyActions.OpenParentFolder.id}
                />
                <Breadcrumbs
                    className={classes.navbarBreadcrumbs}
                    classes={{ separator: classes.separator }}
                >
                    {folderChainComponents}
                </Breadcrumbs>
            </Box>
        </Box>
    );
};

const useStyles = makeChonkyStyles((theme) => ({
    navbarWrapper: {
        paddingBottom: theme.margins.rootLayoutMargin,
    },
    navbarContainer: {
        backgroundColor: theme.colors.debugGreen,
        display: 'flex',
    },
    upDirectoryButton: {
        fontSize: important(theme.toolbar.fontSize),
        height: theme.toolbar.size,
        width: theme.toolbar.size,
        padding: '0px !important',
    },
    navbarBreadcrumbs: {
        fontSize: important(theme.toolbar.fontSize),
        flexGrow: 100,
    },
    baseBreadcrumb: {
        color: important(theme.colors.textPrimary),
    },
    disabledBreadcrumb: {
        color: important(theme.colors.textSubtle),
    },
    currentBreadcrumb: {
        textDecoration: important('underline'),
    },
    separator: {
        marginRight: important(4),
        marginLeft: important(4),
    },
}));
