import React from 'react';
import Link from "next/link";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ReceiptIcon from '@material-ui/icons/Receipt';
import FeedbackIcon from '@material-ui/icons/Feedback';

export const SideBarItems = (
	<div>
		<ListItem button>
			<ListItemIcon>
				<AccountBoxIcon />
			</ListItemIcon>
			<ListItemText primary="My Account" />
		</ListItem>
		<ListItem button>
			<ListItemIcon>
				<ReceiptIcon />
			</ListItemIcon>
			<Link prefetch href="/myorders">
				<ListItemText primary="My Orders" />
			</Link>
		</ListItem>
		<ListItem button>
			<ListItemIcon>
				<FeedbackIcon />
			</ListItemIcon>
			<ListItemText primary="Give Feedback" />
		</ListItem>
	</div>
);
